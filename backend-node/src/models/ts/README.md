# TypeScript Mongoose Models

This folder contains TypeScript-based Mongoose models for:
- User (with budgets subdocuments and password hashing)
- Transaction (references User)
- Suggestion (references User)
- Subscription (references User)

Usage in TypeScript:
```ts
import { User, Transaction, Suggestion, Subscription } from "./models/ts";
```

If your project currently runs JavaScript, you can transpile these with ts-node or integrate TypeScript build tooling.
