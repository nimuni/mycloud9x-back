const mongoose = require('mongoose');
const { Schema } = mongoose;

// 각 아래의 경우에 driveCapacity를 변경해야함.
// 파일을 저장할 때
// 파일을 삭제할 때
// path를 추가할 때
// path를 삭제할 때
// totalCapacity를 수정할 때

const driveCapacitySchema = new Schema(
  {
    path: {
      type: String,
      required: true,
    },
    totalCapacity: { type: Number, required: true },
    usedCapacity: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DriveCapacity', driveCapacitySchema);
