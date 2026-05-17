# Screenshots Guide

Both stores require screenshots taken from actual devices or a simulator.
Capture these 5 screens in order — they tell the app's story.

## Screens to capture

| # | Screen | What to show |
|---|---|---|
| 1 | Home screen | A user with 2–3 medications, adherence at 100%, upcoming dose today |
| 2 | Add Medication form | Medication name filled in, time picker visible, Custom Days selected |
| 3 | Medication detail | Full detail view with schedule, notes, and Today's Status |
| 4 | Notification (system UI) | The alarm notification with "Mark Taken" and "Snooze" actions visible |
| 5 | Settings | Backup section and About visible |

## Android (Google Play) sizes

| Slot | Minimum | Maximum | Notes |
|---|---|---|---|
| Phone screenshots | 320px shortest side | 3840px longest side | JPG or PNG, 2–8 screenshots required |
| Recommended | 1080×1920px | | Portrait orientation |
| Feature graphic | 1024×500px | | Required — banner shown in store browse |
| App icon | 512×512px | | PNG, no transparency |

Use the Android emulator in Android Studio:
1. AVD Manager → Pixel 6 (or similar) → API 34
2. Run app on emulator
3. Screenshot with the camera button in the emulator toolbar

## iOS (App Store) sizes

You need screenshots for **at least two** device classes:

| Device class | Canvas size | Required |
|---|---|---|
| iPhone 6.5" (iPhone 14 Plus / 15 Plus) | 1284×2778px | Yes |
| iPhone 5.5" (iPhone 8 Plus) | 1242×2208px | Yes |
| iPad Pro 12.9" (3rd gen+) | 2048×2732px | Optional but recommended |

Use Xcode Simulator:
1. Xcode → Open Simulator → select device
2. Run the app
3. File → Take Screenshot (or Cmd+S)
4. Screenshots save to Desktop

## Tips

- Add real-looking medication names (e.g. "Metformin 500mg", "Vitamin D3")
- Set reminder times in the near future so the "next dose" chip shows a real time
- Take screenshots in light mode (the app only has light mode — this matches)
- For the notification screenshot, trigger a test notification from Settings
- You can annotate screenshots with feature callouts using Canva or Figma
