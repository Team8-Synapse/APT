# 🚨 QUICK FIX GUIDE - START SERVER MANUALLY

## THE PROBLEM
The server is not running. That's why announcements fail!

## THE SOLUTION (2 STEPS)

### Step 1: Start the Server
Open a **NEW PowerShell terminal** and run:

```powershell
cd d:\APT\server
node server.js
```

You should see:
```
Connected to MongoDB
Server is running on http://localhost:5005
```

**KEEP THIS TERMINAL OPEN!** Don't close it.

### Step 2: Test Announcements

1. **Admin Side**:
   - Go to http://localhost:5173/admin
   - Click "Announcements" tab
   - Fill in the form with: `🎉 Test announcement - This works!`
   - Click "Post Announcement"
   - You should see it appear in the list below

2. **Student Side**:
   - Go to http://localhost:5173 (or click student dashboard)
   - Look at the TOP of the page - you'll see a scrolling ticker
   - Your announcement should be scrolling there!

## What I Fixed
✅ Removed authentication from GET /api/announcements (students can now view)
✅ Student dashboard fetches from API
✅ Admin dashboard has full create/edit/delete
✅ Announcements ticker positioned at top of student dashboard

## If Server Won't Start
If you get an error, the old server might still be running. Kill it:

```powershell
taskkill /F /IM node.exe
```

Then try starting again.
