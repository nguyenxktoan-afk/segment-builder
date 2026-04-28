import { Input, Textarea } from '@/components/ui/input';
import type { ActionEmailData } from '@/types/journey';

interface Props {
  data: ActionEmailData;
  onChange: (patch: Partial<ActionEmailData>) => void;
}

export function ActionEmailForm({ data, onChange }: Props) {
  return (
    <div className="space-y-3">
      <Input
        label="Subject"
        placeholder="e.g. You've got a special offer!"
        value={data.subject}
        onChange={e => onChange({ subject: e.target.value })}
      />
      <Input
        label="Sender address"
        type="email"
        placeholder="noreply@vnggames.com"
        value={data.sender}
        onChange={e => onChange({ sender: e.target.value })}
      />
      <Textarea
        label="Body"
        placeholder="Write your email body…"
        rows={5}
        value={data.body}
        onChange={e => onChange({ body: e.target.value })}
      />
    </div>
  );
}
