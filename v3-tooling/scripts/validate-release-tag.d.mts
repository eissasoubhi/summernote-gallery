export function expectedReleaseTag(version: string): string;

export function validateReleaseTag(tag: string | undefined, version: string): string;

export function validateReleaseTagFromEnvironment(options?: {
  tag?: string;
  packagePath?: URL;
}): Promise<string>;
