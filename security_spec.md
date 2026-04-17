# security_spec.md - ModeDash Security Specification

## 1. Data Invariants
- An **Order** must have a valid `customerId` matching the authenticated user.
- An **Order**'s `storeId` must point to an existing store.
- **Products** can only be read by anyone, but updated only by admins/store owners (if implemented).
- **Users** can only read and write their own profile (`/users/{userId}`).
- **Orders** can be read by the `customerId` or a `partnerId`.
- **Order Status Transitions**: Once `delivered` or `cancelled`, no further updates are allowed.

## 2. The "Dirty Dozen" Payloads (Denial Expected)
1. Creating an order with a `customerId` that isn't mine.
2. Updating an order's `total` after it's been created (price tampering).
3. Updating an order's `status` to `delivered` as a customer (self-completing delivery).
4. Reading another user's profile in `/users/{userId}`.
5. Deleting a store document.
6. Injecting a 1MB string into a product's name.
7. Creating a store with a self-assigned `isAdmin` field in a metadata map.
8. Updating a cancelled order.
9. Listing all orders without filtering by my `customerId`.
10. Creating a product without a `storeId`.
11. Spoofing `createdAt` with a client-side timestamp instead of `request.time`.
12. Creating an order for a non-existent store.

## 3. Test Runner
(A `firestore.rules.test.ts` would be implemented here if a test environment was provided. I will ensure the rules handle these cases.)
