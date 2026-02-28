# API Service Documentation

## Overview

The API Service layer provides a clean, type-safe interface for making authenticated requests to the backend server. It automatically includes the authentication token from your Supabase session in all requests.

## Components

### 1. ApiService (`services/ApiService.ts`)

Core service that handles HTTP requests with authentication headers.

**Features:**
- Automatic token injection into request headers
- Support for GET, POST, PUT, PATCH, DELETE methods
- Type-safe responses with TypeScript generics
- Error handling and status codes
- Reads `SERVER_URL` from `.env` variables

**Configuration:**
```env
VITE_SERVER_URL=http://localhost:8000
```

### 2. Custom Hook - useApi (`hooks/useApi.ts`)

React hook that wraps ApiService and automatically provides the authentication token from AuthContext.

**Features:**
- No need to manually pass tokens
- Automatic authentication context integration
- Check authentication status with `isAuthenticated`
- Available in any React component within AuthProvider

## Usage Examples

### Basic Requests with useApi Hook (Recommended)

```typescript
import { useApi } from '@/hooks/useApi'

function MyComponent() {
  const api = useApi()

  // GET request
  const { data, success, error } = await api.get('/api/events/')

  // POST request
  const response = await api.post('/api/events/', {
    title: 'New Event',
    date: '2026-03-15',
  })

  // PUT request
  await api.put('/api/user/', { notifications_enabled: true })

  // DELETE request
  await api.delete('/api/events/123/')
}
```

### Using ApiService Directly

```typescript
import { apiService } from '@/services/ApiService'

// When you have a token from another source
const response = await apiService.get('/api/events/', myToken)
```

## API Response Structure

All API methods return a standardized response object:

```typescript
interface ApiResponse<T> {
  success: boolean        // Whether the request was successful
  data?: T               // Response data (if successful)
  error?: string         // Error message (if failed)
  status: number         // HTTP status code
}
```

## Error Handling

```typescript
const api = useApi()
const response = await api.post('/api/events/', eventData)

if (response.success) {
  console.log('Event created:', response.data)
} else {
  // Handle error
  if (response.status === 401) {
    // Unauthorized - user needs to log in
  } else if (response.status === 400) {
    // Bad request - invalid data
  }
  console.error(response.error)
}
```

## Authentication

The API Service automatically adds the authentication header to all requests:

```javascript
Authorization: Bearer <session_token>
```

The token is extracted from the Supabase session in AuthContext. If no token is available, requests are still made but without authentication headers.

## Type Safety

Use TypeScript generics for type-safe responses:

```typescript
interface Event {
  id: number
  title: string
  date: string
}

// Type-safe response
const response = await api.get<Event[]>('/api/events/')
// response.data is typed as Event[] | undefined
```

## File Structure

```
src/
├── services/
│   └── ApiService.ts          # Core API service
├── hooks/
│   └── useApi.ts              # React hook wrapper
├── contexts/
│   └── AuthContext.ts         # Authentication context
├── examples/
│   └── ApiServiceExample.ts   # Usage examples
└── .env.example               # Environment template
```

## Best Practices

1. **Always use useApi hook** in React components for automatic token handling
2. **Check isAuthenticated** before making requests that require auth
3. **Handle errors appropriately** with status code checks
4. **Use TypeScript generics** for type-safe API responses
5. **Keep sensitive data** out of request bodies sent over HTTP (though they should be sent over HTTPS)
6. **Set VITE_SERVER_URL** correctly in your `.env` file for each environment

## Django Backend Integration

Your Django views should use the `@authenticate_required` decorator:

```python
from core.middleware.authentication import authenticate_required
from django.http import JsonResponse

@authenticate_required
def get_events(request):
    # request.user_data contains the authenticated user
    return JsonResponse({'events': [...]})
```

The decorator expects: `Authorization: Bearer <token>` header format
