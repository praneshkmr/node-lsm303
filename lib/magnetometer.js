var i2c = require('i2c-bus');
var utils = require('./util');

var mag_address = 0x1e;
var mag_device = '/dev/i2c-1'

function Magnetometer(options) {
    if (options && options.address) {
        mag_address = options.address;
    }
    if (options && options.device) {
        mag_device = options.device;
    }
    var i2cbus = i2c.openSync(1);
    this.accel = {
        i2cbus : i2cbus,
        readBytes: function(addr, count, callback) {
            var buffer = Buffer.alloc(count);
            return this.i2cbus.readI2cBlock(this.address, addr, count, buffer, function(err, bytesRead, buffer) { return callback(err, err?null:Array.prototype.slice.call(buffer, 0));
        });},
        writeBytes: function(addr, bytes, callback) {
            if (bytes && bytes.length == 1)
                return this.i2cbus.writeByte(this.address, addr, bytes[0], callback);
            else {
                var buffer = Buffer.from(bytes || []);
                return this.i2cbus.writeI2cBlock(this.address, addr, buffer.length, buffer, callback);
            }
        },
        address: mag_address
    }
    this.init();
    this.enableTempSensor();
}

Magnetometer.prototype.setOffset = function(x, y, z) {
    utils.setOffset(x, y, z);
    return;
}
Magnetometer.prototype.init = function(){
    this.mag.writeBytes(0x02, [0x00], function(err) {
        if(err){
            console.log("Error enabling Magnetometer : "+err);
        }
        else{
            console.log("Magnetometer Enabled; Set into continuous conversation mode");
        }
    });
}
Magnetometer.prototype.enableTempSensor = function(){
    this.mag.writeBytes(0x00, [0x90], function(err) {
        if(err){
            console.log("Error enabling Temperature Sensor : "+err);
        }
        else{
            console.log("Temperature Sensor Enabled; 15hz register update");
        }
    });
}
Magnetometer.prototype.readAxes = function(callback){
    this.mag.readBytes(0x03, 6, function(err, res) {
        callback(err,utils.buffToXYZMag(res));
    });
}
Magnetometer.prototype.readHeading = function(callback){
    this.mag.readBytes(0x03, 6, function(err, res) {
        callback(err, utils.buffToHeadMag(res));
    });
}
Magnetometer.prototype.readTemp = function(callback){
    this.mag.readBytes(0x31, 2, function(err, res) {
        callback(err,utils.buffToTemp(res));
    });
}
module.exports = Magnetometer;
