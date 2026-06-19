# Periodic Usage Tracking Migration Guide

> **Historical document** — describes the pre-Firestore Opineeo survey product (Prisma + PostgreSQL).  
> Current usage tracking: AI responses in `companies/{id}/usage/{YYYY-MM}`. See [docs/spec/12-subscription-and-billing.md](../spec/12-subscription-and-billing.md).

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

*(Remaining content preserved for historical reference.)*
