# TODO: Clear All Non-Admin Users (Delete users who have logged in, keep admin)

## Information Gathered:
- No explicit login tracking in User model.
- All non-admin users can login.
- server.js auto-seeds specific admin on start.

## Steps:
1. [x] Create this TODO.md
2. [x] Update server.js admin seed to new credentials (Vashu11 / vs3427901@gmail.com / Vashu1234@#)
3. [x] Add DELETE endpoint in adminRoutes.js to delete all role:'user'
4. [ ] Test: Run server, login admin, call DELETE /api/admin/users/clear-regular, check /users
5. [ ] Mark complete

Progress tracked here.
