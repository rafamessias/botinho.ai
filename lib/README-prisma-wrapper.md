# Prisma Team Wrapper

A TypeScript wrapper for Prisma that automatically injects team ID into CRUD operations based on the current user's default team.

## Features

- **Automatic Team ID Injection**: Automatically adds the current user's default team ID to create operations
- **Team-based Filtering**: All read operations are automatically filtered by the user's team ID
- **Security**: Update and delete operations validate that records belong to the user's team
- **Type Safety**: Full TypeScript support with proper type inference
- **Session Integration**: Works seamlessly with NextAuth.js sessions

## Usage

### Basic Setup

```typescript
import { getPrismaWrapper } from '@/lib/prisma-wrapper'

// Get a wrapper instance
const wrapper = getPrismaWrapper()
```

### CRUD Operations

#### Create
```typescript
const project = await wrapper.create(prisma.project, {
  name: "My Project",
  description: "Project description"
  // teamId is automatically injected
})
```

#### Read
```typescript
// Find many records (automatically filtered by team ID)
const projects = await wrapper.findMany(prisma.project, {
  orderBy: { createdAt: 'desc' }
})

// Find unique record (automatically filtered by team ID)
const project = await wrapper.findUnique(prisma.project, {
  where: { id: 1 }
})

// Find first record (automatically filtered by team ID)
const project = await wrapper.findFirst(prisma.project, {
  where: { name: { contains: "My" } }
})
```

#### Update
```typescript
// Automatically validates that the record belongs to the user's team
const project = await wrapper.update(prisma.project, {
  where: { id: 1 },
  data: { name: "Updated Name" }
})
```

#### Delete
```typescript
// Automatically validates that the record belongs to the user's team
await wrapper.delete(prisma.project, {
  where: { id: 1 }
})
```

#### Count
```typescript
// Count records (automatically filtered by team ID)
const count = await wrapper.count(prisma.project)
```

#### Upsert
```typescript
const project = await wrapper.upsert(prisma.project, {
  where: { id: 1 },
  create: { name: "New Project" },
  update: { name: "Updated Project" }
})
```

### Getting Team ID

```typescript
const teamId = await wrapper.getTeamId()
```

### Refreshing Team ID

When a user's default team changes, you can refresh the wrapper's team ID:

```typescript
// Refresh the team ID from the database
await wrapper.refreshTeamId()

// Or use the singleton helper
import { refreshPrismaWrapperTeamId } from '@/lib/prisma-wrapper'
await refreshPrismaWrapperTeamId()
```

### Resetting the Wrapper

To force complete re-initialization:

```typescript
// Reset the wrapper instance
wrapper.reset()

// Or use the singleton helper
import { resetPrismaWrapper } from '@/lib/prisma-wrapper'
resetPrismaWrapper()
```

## Prerequisites

1. **User Model**: Your user model must have a `defaultTeamId` field
2. **Team Association**: Your models must have a `teamId` field that references the team
3. **Authentication**: User must be authenticated via NextAuth.js

## Model Requirements

For the wrapper to work, your Prisma models should include:

```prisma
model YourModel {
  id        Int      @id @default(autoincrement())
  // ... other fields
  teamId    Int
  team      Team     @relation(fields: [teamId], references: [id])
  
  @@map("your_model")
}
```

## Error Handling

The wrapper throws descriptive errors for common scenarios:

- `"User not authenticated"` - When no valid session is found
- `"User not found"` - When the user doesn't exist in the database
- `"User has no default team assigned"` - When the user has no default team
- `"Record not found"` - When trying to access a non-existent record
- `"Access denied: Record does not belong to your team"` - When trying to access records from other teams

## Security

The wrapper provides automatic security by:

1. **Team Isolation**: All operations are automatically scoped to the user's team
2. **Access Validation**: Update/delete operations verify record ownership
3. **Session Validation**: Ensures user is properly authenticated
4. **Team Validation**: Ensures user has a valid default team

## Examples

See `prisma-wrapper-example.ts` for complete usage examples including server actions and React components.

## Best Practices

1. **Use the wrapper for all team-scoped operations** - Don't mix direct Prisma calls with wrapper calls for the same data
2. **Handle errors gracefully** - The wrapper throws errors that should be caught and handled appropriately
3. **Initialize once** - The wrapper caches the team ID, so it's efficient to use the same instance
4. **Type your data** - Use proper TypeScript types for better development experience
