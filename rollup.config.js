import typescript from 'rollup-plugin-typescript2';

export default {
    input: './src/index.ts',
    output: {
        file: './lib/ibankit.es.js',
        format: 'esm'
    },
    plugins: [
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    module: 'ES2015',
                    declaration: false
                }
            }
        })
    ]
}
