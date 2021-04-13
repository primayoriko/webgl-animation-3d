const angle = {
  degToRad: (deg) => {
    return (deg * Math.PI) / 180;
  },
  radToDeg: (rad) => {
    return (rad * 180) / Math.PI;
  }
}

export default angle;