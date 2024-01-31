# PitchDemo

Basic Angular application showcasing our hackathon model in a ifcjs context.

1. Run `nvm use` (or make sure you have `node >= 20`)
2. Run `npm install`
3. Make sure all the IFC files as per the `app.component.ts` are located inside `src/assets`
4. Run `npm start` and access the app on http://localhost:4200

The app loads all the models upon loading the app and adds them to the scene. The console has more output (mainly from the ifcjs library).

Note: The code is based on some of the tutorials, adjusted a tiny wee bit for Angular specifics and by no means used for anything other than a short demo. There seems to be a memory leak issue; so make sure to open it in incognito mode and new tabs.
