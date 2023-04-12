import * as fs from "node:fs";
import * as path from "node:path";

export function make_static(staticdir: string, publicdir: string) {
	// copy static files
	for (const p of fs.readdirSync(staticdir)) {
		fs.cpSync(path.join(staticdir, p), path.join(publicdir, p), {
			recursive: true,
		});
	}
}
