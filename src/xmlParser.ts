import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import * as xml2js from "xml2js";
import * as _ from "lodash";

// Convert fs.readFile into Promise version of same
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const stat = util.promisify(fs.stat);
const parser = new xml2js.Parser();

export const parseFiles = async () => {
  const directoryPath = path.join(__dirname, "../reports");
  const allContents = await parseFolder(directoryPath);
  return _.flattenDeep(allContents);
};

export const parseFolder = async (baseDirectory: string): Promise<any[]> => {
  const files: any[] = await readdir(baseDirectory);
  return await Promise.all(files.map(async fileName => {
    const fullPath = path.join(baseDirectory, fileName);
    const stats = await stat(fullPath);
    if (stats.isDirectory()){
      // recursive
      return await parseFolder(fullPath);
    }
    if (stats.isFile()){
      console.log(`parsing ${fullPath}`);
      return await parseFile(fullPath);
    }
  }));
};

export const parseFile = async (fileName: string) => {
  const data: any = await readFile(fileName);
  return await parser.parseStringPromise(data);
};