import fs from 'fs';

// Read the original Invitation.vue from scratch/old_invitation.vue
const oldCode = fs.readFileSync('scratch/old_invitation.vue', 'utf8');

// Write back to resources/js/Pages/Demo/Invitation.vue
fs.writeFileSync('resources/js/Pages/Demo/Invitation.vue', oldCode, 'utf8');
console.log('Restored original Invitation.vue successfully!');
