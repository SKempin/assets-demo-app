# Demo App — Expo + Firebase

Minimal Expo app demonstrating Firebase Authentication and Firestore asset CRUD.

## App Tour

📱 [Watch the app tour](docs/app-tour.gif)


## Key features
- [x] Login handling.
- [x] Logout handling.
- [x] Create, read, update, delete Firestore documents (assets).
- [x] Assets support 1+ camera images.
- [x] Asset documents include `name`/`description`, `createdAt`, and `images`.
- [x] View a list of all assets.
- [x] View and update details of a specific asset.


## Firestore architecture

- **Context**: Provides a real-time list of all assets for screens like asset listings
- **Individual subscriptions**: Ensure single-asset views stay in sync even if context hasn’t updated yet
- **Automatic cleanup**: Both subscriptions auto-unsubscribe when components unmount

Provides efficient bulk operations and guaranteed real-time individual document updates.




