使用 `rspack` 作为构建工具，根据 `src/modules` 的子目录（不递归）作为入口点，进行编译构建，完善这个工程。

编译规则如下：

`src/modules/{name}/index.ts` 作为入口点，编译到 `dist/{name}.js`，如果没有则不编译。

`src/modules/{name}/index.scss` 作为入口点，编译到 `dist/{name}.css` 如果没有不编译。
