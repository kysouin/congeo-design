export type ToolId = 'kaneto' | 'rhoi' | 'trace' | 'permitflow' | 'internal';
export type StatusId = 'ok' | 'warn' | 'err' | 'proposal' | 'event';
/** A tool colour or a status colour. Sets the --cg-tool custom properties through data attributes. */
export type Accent = { tool: ToolId; status?: never } | { status: StatusId; tool?: never };

export function accentAttrs(accent?: Accent | null): { 'data-tool'?: ToolId; 'data-status'?: StatusId } {
  if (!accent) return {};
  if ('tool' in accent && accent.tool) return { 'data-tool': accent.tool };
  if ('status' in accent && accent.status) return { 'data-status': accent.status };
  return {};
}
