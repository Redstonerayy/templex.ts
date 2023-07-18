import Markdown from "markdown-it";
import * as fs from "fs";
import * as path from "path";

import { Config } from "../interfaces/interfaces.js";
import { walk_dir } from "../filesystem/filesystem.js";
import { extract_metadata } from "./metadata.js";

/*------------ function to process all markdown files ------------*/
export function build_pages(config: Config, publicdir: string) {
	/*------------ directories ------------*/
	const layoutdirpath: string = path.join(config.rootdir, config.layoutdir);
	const contentdir = path.join(config.rootdir, config.contentdir);

	/*------------ get content files ------------*/
	const contentfiles = [...walk_dir(contentdir)];

	const md = new Markdown({});

	for (const cfile of contentfiles) {
		/*------------ calculate outpath ------------*/
		const splitted = cfile.split(path.sep);
		let outpath = path.join(
			publicdir,
			splitted.slice(splitted.indexOf("content") + 1).join(path.sep)
		);

		/*------------ just copy non markdown ------------*/
		if (path.extname(cfile) !== ".md") {
			if (!fs.existsSync(path.dirname(outpath)))
				fs.mkdirSync(path.dirname(outpath));

			fs.copyFileSync(cfile, outpath);
			/*------------ render markdown ------------*/
		} else if (path.extname(cfile) === ".md") {
			/*------------ read md file ------------*/
			let filecontent = fs.readFileSync(cfile, { encoding: "utf-8" });

			/*------------ extract metadata ------------*/
			let [metadata, markdown] = extract_metadata(filecontent);

			/*------------ compile markdown to html ------------*/
			let markdownhtml = md.render(markdown);

			/*------------ change outpath extension to .html ------------*/
			outpath = outpath.replace(".md", ".html");

			/*------------ write html to file ------------*/
			if (!fs.existsSync(path.dirname(outpath)))
				fs.mkdirSync(path.dirname(outpath));

			fs.writeFileSync(outpath, markdownhtml, { encoding: "utf-8" });
		}
	}
}
