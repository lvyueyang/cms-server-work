// 最大范围的全局变量白名单（包含大部分安全的全局对象）
function createMaxWhitelist() {
  // 基础数据类型构造函数
  const primitives = {
    Number: Number,
    String: String,
    Boolean: Boolean,
    Array: Array,
    Object: Object,
    Date: Date,
    RegExp: RegExp,
  };

  // 安全的全局函数
  const safeFunctions = {
    isNaN: isNaN,
    isFinite: isFinite,
    parseFloat: parseFloat,
    parseInt: parseInt,
    decodeURI: decodeURI,
    decodeURIComponent: decodeURIComponent,
    encodeURI: encodeURI,
    encodeURIComponent: encodeURIComponent,
  };

  // 合并所有安全的全局对象
  return {
    ...primitives,
    ...safeFunctions,
    Math: Math,
    JSON: JSON,
    // 可根据需要添加其他安全的全局对象
    console: {
      log: console.log,
      warn: console.warn,
      error: console.error,
    },
  };
}

// 创建支持最大白名单的执行环境
export function createMaxSafeFunction(code: string) {
  const whitelist = createMaxWhitelist();
  const allowedKeys = Object.keys(whitelist);

  // 构建安全执行的函数体
  const safeCode = `
    "use strict";
    return (function(${allowedKeys.join(', ')}) {
      ${code}
    })(${allowedKeys.join(', ')});
  `;
  try {
    const func = new Function(...allowedKeys, safeCode);
    return (...args) => func(...Object.values(whitelist), ...args);
  } catch (err) {
    throw new Error(`代码解析错误: ${err.message}`);
  }
}

// // ------------------------------
// // 使用示例
// // ------------------------------

// // 复杂的数据处理代码（可使用大部分安全的全局功能）
// const complexCode = `
//   // 使用数组方法
//   const sorted = ArrayPrototype.sort.call(data, (a, b) => a - b);

//   // 使用Math
//   const stats = {
//     sum: ArrayPrototype.reduce.call(sorted, (acc, val) => acc + val, 0),
//     mean: sum / sorted.length,
//     stdDev: Math.sqrt(
//       ArrayPrototype.reduce.call(sorted, (acc, val) => acc + Math.pow(val - mean, 2), 0) / sorted.length
//     )
//   };

//   // 使用日期和字符串方法
//   const report = {
//     generatedAt: new Date().toISOString(),
//     dataType: ObjectPrototype.toString.call(data),
//     stats: stats
//   };

//   return JSON.stringify(report);
// `;

// // 创建处理器并执行
// const processor = createMaxSafeFunction(complexCode);
// const result = processor([12, 45, 23, 67, 34]);
// console.log(JSON.parse(result));

// // 尝试访问危险对象会失败
// const testDangerousCode = `
//   try {
//     // 尝试访问window（会抛出错误）
//     return window ? '危险访问成功' : '安全';
//   } catch (e) {
//     return '安全：' + e.message;
//   }
// `;
// const testProcessor = createMaxSafeFunction(testDangerousCode);
// console.log(testProcessor()); // 输出安全提示
