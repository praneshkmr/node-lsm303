function Utils() {
    
}

Utils.buffToXYZAccel= function(buffer){  
    var pos;
    pos = {
        x: this.trueRound( this.twoscomp((buffer[0] | (buffer[1] << 8)) >> 4,12) * 0.001 * 9.80665 , 1),
        y: this.trueRound( this.twoscomp((buffer[2] | (buffer[3] << 8)) >> 4,12) * 0.001 * 9.80665 , 1),
        z: this.trueRound( this.twoscomp((buffer[4] | (buffer[5] << 8)) >> 4,12) * 0.001 * 9.80665 , 1)
    };
    return pos;
}

Utils.buffToTemp = function(buffer){
  var temp;
  temp = {
    temp : (((buffer[0] << 8) | buffer[1]) >> 4)/8 + 18
  };
  return temp;
}

Utils.buffToXYZMag = function(buffer){
  var pos;
  pos = {
    x: this.twoscomp((buffer[0] << 8) | buffer[1],16),
    z: this.twoscomp((buffer[2] << 8) | buffer[3],16),
    y: this.twoscomp((buffer[4] << 8) | buffer[5],16)
  };
  return pos;
}

Utils.twoscomp = function(value,no_of_bits) {
  var upper = Math.pow(2,no_of_bits);
  if (value > upper / 2) {
    return value - upper;
  }
  else{
    return value;
  }
}

Utils.trueRound = function(value, digits){
    return parseFloat((Math.round((value*Math.pow(10,digits)).toFixed(digits-1))/Math.pow(10,digits)).toFixed(digits));
}

module.exports = Utils;