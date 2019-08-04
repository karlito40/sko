const attackDefault = [
  { width: 40, height: 31, x: 519, y: 131 },
  { width: 53, height: 36, x: 399, y: 128 },
  { width: 53, height: 22, x: 459, y: 140 },
];

export default {
  id: 'Wadle',
  name: 'Waddle Doo',
  animations: {
    idle: [
      { width: 29, height: 22, x: 360, y: 142 },
    ],
    attack: attackDefault,
    attack_Kirby: attackDefault,
    death: [
      { width: 40, height: 35, x: 571, y: 129 },
      { width: 45, height: 24, x: 623, y: 134 },
    ]
  }
};