import { useEffect, useState } from "react";
import { Loader2Icon, PlusIcon, TagIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useData } from "@/auth/AuthProvider";

/**
 * Manage tags — the student labels used across the directory
 * (dance style, batch, event, level…).
 *
 * Create / rename (save on blur or Enter) / delete. Every mutation calls
 * `onChanged` so the parent (Members page) can refresh its filter list.
 */
export function TagsDialog({ open, onOpenChange, onChanged }) {
    const data = useData();
    const [rows, setRows] = useState(null); // null = loading
    const [name, setName] = useState("");
    const [color, setColor] = useState("#6366f1");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!open)
            return;
        let live = true;
        setRows(null);
        setName("");
        data.listTags()
            .then((list) => { if (live) setRows(list); })
            .catch((error) => {
                if (!live) return;
                setRows([]);
                toast.error(error instanceof Error ? error.message : "Unable to load tags.");
            });
        return () => { live = false; };
    }, [open, data]);

    async function handleCreate() {
        const trimmed = name.trim();
        if (!trimmed || busy)
            return;
        setBusy(true);
        try {
            const created = await data.createTag({ name: trimmed, color });
            setRows((prev) => [...(prev ?? []), created].sort((a, b) => a.name.localeCompare(b.name)));
            setName("");
            onChanged?.();
            toast.success(`Tag "${created.name}" created.`);
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to create the tag.");
        }
        finally {
            setBusy(false);
        }
    }

    async function handleRename(id, nextName) {
        const trimmed = nextName.trim();
        const current = rows?.find((t) => t.id === id);
        if (!current || !trimmed || trimmed === current.name)
            return;
        try {
            const updated = await data.updateTag(id, { name: trimmed });
            setRows((prev) => (prev ?? []).map((t) => (t.id === id ? updated : t)).sort((a, b) => a.name.localeCompare(b.name)));
            onChanged?.();
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to rename the tag.");
        }
    }

    async function handleDelete(tag) {
        try {
            await data.deleteTag(tag.id);
            setRows((prev) => (prev ?? []).filter((t) => t.id !== tag.id));
            onChanged?.();
            toast.success(`Tag "${tag.name}" deleted.`);
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to delete the tag.");
        }
    }

    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><TagIcon className="size-4"/> Manage tags</DialogTitle>
          <DialogDescription>
            Labels to group students — dance style, batch, event or level. Deleting a tag removes it from every student.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-9 w-9 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0" aria-label="New tag colour"/>
          <Input value={name} onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void handleCreate(); } }}
            placeholder="New tag name (e.g. Hip-Hop Crew)" aria-label="New tag name"/>
          <Button className="shrink-0" size="sm" disabled={busy || !name.trim()} onClick={() => void handleCreate()}>
            {busy ? <Loader2Icon className="size-4 animate-spin"/> : <><PlusIcon className="size-4"/> Add</>}
          </Button>
        </div>

        <div className="max-h-[50dvh] space-y-1.5 overflow-y-auto">
          {rows === null ? (<p className="py-6 text-center text-sm text-muted-foreground">Loading tags…</p>)
            : rows.length === 0 ? (<p className="py-6 text-center text-sm text-muted-foreground">No tags yet — add the first one above.</p>)
            : rows.map((tag) => (<div key={tag.id} className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/40 px-2 py-1.5">
                <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: tag.color }} aria-hidden="true"/>
                <Input defaultValue={tag.name} className="h-8 flex-1 bg-transparent" aria-label={`Tag name: ${tag.name}`}
                  onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); } }}
                  onBlur={(event) => void handleRename(tag.id, event.target.value)}/>
                <Button variant="ghost" size="icon-sm" aria-label={`Delete tag ${tag.name}`} className="text-muted-foreground hover:text-destructive"
                  onClick={() => void handleDelete(tag)}>
                  <Trash2Icon className="size-4"/>
                </Button>
              </div>))}
        </div>
      </DialogContent>
    </Dialog>);
}
