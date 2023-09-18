import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import {defineConfig} from "rollup";

export default defineConfig({
    input: "src/index.ts", // 打包入口
    output: [{
        // 打包出口
        file: "dist/vue-ls.js", // 最终打包出来的文件路径和文件名，这里是在package.json的browser: 'dist/index.js'字段中配置的
        format: 'esm', // esm,umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
    },{
        // 打包出口
        name:"VueStorage",
        file: "dist/vue-ls.iife.js", // 最终打包出来的文件路径和文件名，这里是在package.json的browser: 'dist/index.js'字段中配置的
        format: 'iife', // esm,umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
    },
    ],
    plugins: [
        // 打包插件
        // resolve({
        //   preferBuiltins:false
        // }), // 查找和打包node_modules中的第三方模块
        typescript(), // 解析TypeScript
        json(), //解析json
    ],
});
