import minimist from 'minimist';

export const getArgs = <T extends minimist.ParsedArgs>(ops?: minimist.Opts): T => minimist<T>(process.argv.slice(2), ops);