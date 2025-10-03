# Periodic Usage Tracking Migration Guide

## Overview

This guide explains how to migrate from the old usage tracking system to the new periodic-based tracking system that properly handles monthly and yearly billing periods.

## Schema Changes

### Before (Old System)
```prisma
model UsageTracking {
  id             String               @id @default(cuid())
  teamId         Int
  subscriptionId String
  metricType     UsageMetricType
  currentUsage   Int                  @default(0)
  limitValue     Int
  lastResetDate  DateTime?
  lastUpdated    DateTime             @default(now())
  createdAt      DateTime             @default(now())
  
  @@unique([teamId, metricType])  // Only one record per team/metric
}
```

### After (New System)
```prisma
model UsageTracking {
  id             String               @id @default(cuid())
  teamId         Int
  subscriptionId String
  metricType     UsageMetricType
  currentUsage   Int                  @default(0)
  limitValue     Int
  periodStart    DateTime             @default(now())
  periodEnd      DateTime
  lastResetDate  DateTime?
  lastUpdated    DateTime             @default(now())
  createdAt      DateTime             @default(now())
  
  @@unique([teamId, metricType, periodStart])  // One record per team/metric/period
}
```

## Migration Strategy

### Step 1: Database Migration

1. **Add new columns** to existing `usage_tracking` table:
```sql
ALTER TABLE usage_tracking 
ADD COLUMN period_start TIMESTAMP DEFAULT NOW(),
ADD COLUMN period_end TIMESTAMP;

-- Update existing records with current period
UPDATE usage_tracking ut
SET period_start = ut.created_at,
    period_end = CASE 
      WHEN s.plan_id IN (SELECT id FROM subscription_plans WHERE billing_interval = 'monthly') 
      THEN ut.created_at + INTERVAL '1 month'
      ELSE ut.created_at + INTERVAL '1 year'
    END
FROM customer_subscriptions s
WHERE ut.subscription_id = s.id;
```

2. **Update unique constraint**:
```sql
-- Drop old constraint
ALTER TABLE usage_tracking DROP CONSTRAINT usage_tracking_team_id_metric_type_key;

-- Add new constraint
ALTER TABLE usage_tracking 
ADD CONSTRAINT usage_tracking_team_id_metric_type_period_start_key 
UNIQUE (team_id, metric_type, period_start);
```

3. **Add new indexes**:
```sql
CREATE INDEX idx_usage_tracking_period_start ON usage_tracking(period_start);
CREATE INDEX idx_usage_tracking_period_end ON usage_tracking(period_end);
```

### Step 2: Application Code Migration

#### Old Usage (Before)
```typescript
// Old way - single record per team/metric
const tracking = await prisma.usageTracking.findFirst({
  where: { teamId, metricType }
});

// Manual reset required
if (shouldReset) {
  await prisma.usageTracking.update({
    where: { id: tracking.id },
    data: { currentUsage: 0, lastResetDate: new Date() }
  });
}
```

#### New Usage (After)
```typescript
// New way - automatic period handling
import { getCurrentPeriodTracking, updateUsageTracking } from './lib/periodic-usage-tracking';

// Get current period tracking (creates if doesn't exist)
const tracking = await getCurrentPeriodTracking(teamId, metricType);

// Update usage (automatically handles period boundaries)
await updateUsageTracking({
  teamId,
  metricType: UsageMetricType.ACTIVE_SURVEYS,
  increment: 1
});
```

### Step 3: Billing Period Reset Logic

#### Automatic Reset on Subscription Renewal
```typescript
// When Stripe webhook receives subscription renewal
export async function handleSubscriptionRenewal(subscriptionId: string) {
  // Create new tracking records for new period
  await resetUsageForNewPeriod(subscriptionId);
  
  // Archive old records (optional)
  await archiveOldUsageRecords(subscriptionId);
}
```

#### Manual Reset for Testing
```typescript
// Reset specific team's usage for new period
await resetUsageForNewPeriod(subscriptionId);
```

## Key Benefits of New System

### 1. **Period-Based Tracking**
- ✅ **Automatic period handling** - No manual reset required
- ✅ **Historical data** - Keep track of usage across multiple periods
- ✅ **Billing alignment** - Usage resets align with billing cycles

### 2. **Better Analytics**
```typescript
// Get usage trends over time
const history = await getHistoricalUsageReport(teamId, 6); // Last 6 months

// Get current period usage
const current = await getCurrentPeriodUsageReport(teamId);
```

### 3. **Automatic Cleanup**
```typescript
// Clean up old records (keep last 12 months)
await cleanupOldUsageRecords();
```

## Implementation Timeline

### Phase 1: Schema Update (Week 1)
- [ ] Run database migration
- [ ] Update Prisma schema
- [ ] Deploy schema changes

### Phase 2: Code Migration (Week 2)
- [ ] Replace old usage tracking calls
- [ ] Update subscription renewal logic
- [ ] Add period-based validation

### Phase 3: Testing & Monitoring (Week 3)
- [ ] Test with different billing intervals
- [ ] Monitor usage tracking accuracy
- [ ] Set up alerts for approaching limits

### Phase 4: Cleanup (Week 4)
- [ ] Archive old usage records
- [ ] Remove old code
- [ ] Update documentation

## Rollback Plan

If issues arise, you can rollback by:

1. **Revert schema changes**:
```sql
ALTER TABLE usage_tracking DROP COLUMN period_start;
ALTER TABLE usage_tracking DROP COLUMN period_end;
ALTER TABLE usage_tracking DROP CONSTRAINT usage_tracking_team_id_metric_type_period_start_key;
ALTER TABLE usage_tracking ADD CONSTRAINT usage_tracking_team_id_metric_type_key UNIQUE (team_id, metric_type);
```

2. **Revert to old utility functions**
3. **Restore from backup** if data corruption occurs

## Monitoring & Alerts

### Key Metrics to Monitor
- Usage tracking record creation rate
- Period boundary handling accuracy
- Database performance with new indexes
- Memory usage with historical data

### Recommended Alerts
- Teams approaching limits (80%+ usage)
- Failed period resets
- Database performance degradation
- Unusual usage spikes

## Testing Checklist

- [ ] Monthly plan usage resets correctly
- [ ] Yearly plan usage resets correctly
- [ ] Historical data is preserved
- [ ] New subscriptions create tracking records
- [ ] Subscription renewals reset usage
- [ ] Limit enforcement works correctly
- [ ] Performance is acceptable
- [ ] Cleanup removes old records
- [ ] Analytics queries work correctly
