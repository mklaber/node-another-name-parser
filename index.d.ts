/**
 * A parsed personal name
 */
export type ParsedName = {
    /**
     * Name prefix or title
     */
    prefix: string | null;
    /**
     * First name or given name
     */
    first: string | null;
    /**
     * Middle name or initial
     */
    middle: string | null;
    /**
     * Last name or family name or surname
     */
    last: string | null;
    /**
     * Suffix
     */
    suffix: string | null;
    /**
     * Original input
     */
    original: string;
}
/**
 * Attempts to parse the given personal name into components parts
 * @param name a full personal name to parse
 */
export default function parse(name: string): ParsedName;