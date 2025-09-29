import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SongMeta } from "../types";

interface PlaylistQueueProps {
  songs: SongMeta[];
  currentId?: string;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (newOrder: SongMeta[]) => void;
}

function SortableItem({
  item,
  active,
  onRemove
}: {
  item: SongMeta;
  active?: boolean;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style} className={`queue-item ${active ? "active" : ""}`} {...attributes} {...listeners}>
      <div className="thumb" style={{ width: 48, height: 48, flexShrink: 0 }}>
        <img src={item.cover || '/default-cover.png'} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />
      </div>
      <div style={{ flex: 1, paddingLeft: 8 }}>
        <div style={{ fontWeight: 700, color: '#e0b84a' }}>{item.title}</div>
        <div className="small">{item.artist}</div>
      </div>
      <div style={{ marginLeft: 8 }}>
        <button aria-label="remove" className="btn secondary" onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}>✕</button>
      </div>
    </div>
  );
}

export default function PlaylistQueue({
  songs,
  currentId,
  onSelect,
  onRemove,
  onReorder
}: PlaylistQueueProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const ids = songs.map(s => s.id);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    const newArray = arrayMove(songs, oldIndex, newIndex);
    onReorder(newArray);
  }

  return (
    <div className="playlist">
      <h3>Cola</h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="queue" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {songs.map(s => (
              <div key={s.id} onClick={() => onSelect(s.id)} style={{ cursor: "pointer" }}>
                <SortableItem item={s} active={s.id === currentId} onRemove={onRemove} />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}