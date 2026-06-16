/**
 * Simple synthesis tool using Web Audio API to play alert and feedback sounds
 * live to emulate high-intensity situations without loading external audio assets.
 */
export function playNotificationSound(type: 'order' | 'confirm' | 'delivery' | 'click' = 'order') {
  // Sounds are entirely disabled at the user's request
  return;
}
