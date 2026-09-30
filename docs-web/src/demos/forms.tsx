import { addDays, format, isWeekend, startOfToday } from 'date-fns';
import { de } from 'date-fns/locale/de';
import { useEffect, useId, useState } from 'react';
import {
  Button,
  Checkbox,
  Combobox,
  DatePicker,
  Field,
  Inline,
  Input,
  Label,
  NumberInput,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Switch,
  Text,
  Textarea,
  ToggleGroup,
  type DateRange,
  type SelectOption,
} from '@yarcl/react';

export function FieldDemo() {
  const [email, setEmail] = useState('ada@');
  const invalid = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  return (
    <Stack className="demo-form">
      <Field label="Full name" description="As it appears on your ID." required>
        <Input placeholder="Ada Lovelace" />
      </Field>
      <Field label="Email" error={invalid ? 'Enter a valid email address.' : undefined}>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
    </Stack>
  );
}

export function LabelDemo() {
  const id = useId();
  return (
    <Stack className="demo-form">
      <Inline gap="sm" wrap={false}>
        <Label htmlFor={`${id}-city`} className="demo-label" required>
          City
        </Label>
        <Input id={`${id}-city`} placeholder="Zurich" required className="demo-grow" />
      </Inline>
      <Inline gap="sm" wrap={false}>
        <Label htmlFor={`${id}-nickname`} className="demo-label" disabled>
          Nickname
        </Label>
        <Input id={`${id}-nickname`} placeholder="Unavailable" disabled className="demo-grow" />
      </Inline>
      <Inline gap="sm">
        <Label color="success">Active</Label>
        <Label variant="soft" color="warning" radius="rounded">
          Pending
        </Label>
        <Label variant="outline" color="danger" size="sm" radius="rounded">
          Failed
        </Label>
        <Label variant="solid" color="primary" size="lg">
          New
        </Label>
      </Inline>
    </Stack>
  );
}

export function LabelGroupDemo() {
  const id = useId();
  return (
    <Stack gap="sm" className="demo-form">
      <Label id={`${id}-birth`}>Date of birth</Label>
      <Inline role="group" aria-labelledby={`${id}-birth`} gap="sm" wrap={false}>
        <Input aria-label="Day" placeholder="DD" className="demo-part" inputMode="numeric" />
        <Input aria-label="Month" placeholder="MM" className="demo-part" inputMode="numeric" />
        <Input aria-label="Year" placeholder="YYYY" className="demo-part" inputMode="numeric" />
      </Inline>
    </Stack>
  );
}

export function LabelCustomDemo() {
  const id = useId();
  return (
    <Stack gap="sm">
      <Label id={`${id}-frequency`} color="primary">
        Digest frequency
      </Label>
      <ToggleGroup type="single" defaultValue="weekly" aria-labelledby={`${id}-frequency`}>
        <ToggleGroup.Item value="daily">Daily</ToggleGroup.Item>
        <ToggleGroup.Item value="weekly">Weekly</ToggleGroup.Item>
        <ToggleGroup.Item value="monthly">Monthly</ToggleGroup.Item>
      </ToggleGroup>
    </Stack>
  );
}
export function InputDemo() {
  return (
    <Stack className="demo-form">
      <Input placeholder="Default" aria-label="Default" />
      <Input size="sm" placeholder="Small" aria-label="Small" />
      <Input size="lg" placeholder="Large, success focus color" color="success" aria-label="Large" />
      <Input placeholder="Disabled" disabled aria-label="Disabled" />
      <Inline gap="sm">
        <Input placeholder="Search" aria-label="Search" className="demo-grow" />
        <Button>Search</Button>
      </Inline>
    </Stack>
  );
}

export function NumberInputDemo() {
  const [price, setPrice] = useState<number | null>(12.5);
  return (
    <Stack className="demo-form">
      <Field label="Guests" description="Between 1 and 12 people.">
        <NumberInput min={1} max={12} defaultValue={2} />
      </Field>
      <Field label="Price" description={price === null ? 'No price set.' : `Saved as ${price.toFixed(2)}.`}>
        <NumberInput value={price} onValueChange={setPrice} min={0} step={0.5} />
      </Field>
      <Inline gap="sm">
        <NumberInput size="sm" defaultValue={1} aria-label="Small" />
        <NumberInput size="lg" color="success" defaultValue={1} aria-label="Large" />
        <NumberInput disabled defaultValue={3} aria-label="Disabled" />
      </Inline>
    </Stack>
  );
}

export function TextareaDemo() {
  return (
    <Stack className="demo-form">
      <Field label="One row" description="A one-row textarea is exactly as tall as an input.">
        <Textarea rows={1} placeholder="Say hello" />
      </Field>
      <Field label="Message">
        <Textarea rows={4} placeholder="Write a longer message" />
      </Field>
    </Stack>
  );
}

const plans: SelectOption<'free' | 'pro' | 'team' | 'enterprise'>[] = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
  { value: 'enterprise', label: 'Enterprise (contact sales)', disabled: true },
];

export function SelectDemo() {
  const [plan, setPlan] = useState<(typeof plans)[number]['value'] | null>('pro');
  return (
    <Stack className="demo-form">
      <Field label="Plan" description={`Value: ${plan ?? 'none'}`}>
        <Select options={plans} value={plan} onValueChange={setPlan} placeholder="Choose a plan" />
      </Field>
      <Field label="Uncontrolled, with placeholder">
        <Select options={plans} placeholder="Choose a plan" />
      </Field>
    </Stack>
  );
}

const countries: SelectOption[] = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'Denmark', 'Finland', 'France',
  'Germany', 'Ireland', 'Italy', 'Japan', 'Mexico', 'Netherlands', 'Norway', 'Portugal', 'Spain', 'Sweden',
  'Switzerland', 'United Kingdom', 'United States', 'Uruguay',
].map((name) => ({ value: name.toLowerCase().replace(/\s+/g, '-'), label: name }));

export function ComboboxSearchDemo() {
  const [country, setCountry] = useState<string | null>(null);
  return (
    <Field label="Country" description={`Value: ${country ?? 'none'}`} className="demo-form">
      <Combobox options={countries} value={country} onValueChange={setCountry} placeholder="Search countries" />
    </Field>
  );
}

const frameworks: SelectOption[] = ['React', 'Preact', 'Solid', 'Svelte', 'Vue', 'Angular'].map((name) => ({
  value: name,
  label: name,
}));

export function ComboboxFreeDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Field label="Framework" description={`Value: ${value ?? 'none'}`} className="demo-form">
      <Combobox options={frameworks} allowCustomValue onValueChange={setValue} placeholder="Type anything" />
    </Field>
  );
}

export function ComboboxMultipleDemo() {
  const [visited, setVisited] = useState<string[]>(['sweden', 'japan']);
  return (
    <Field label="Countries visited" description={`Value: ${visited.join(', ') || 'none'}`} className="demo-form">
      <Combobox multiple options={countries} value={visited} onValueChange={setVisited} name="visited" placeholder="Add countries" />
    </Field>
  );
}

export function ComboboxAsyncDemo() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!query.trim()) return setResults([]);
    setLoading(true);
    const timer = setTimeout(() => {
      setResults(countries.filter((c) => c.label.toLowerCase().startsWith(query.trim().toLowerCase())));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);
  return (
    <Field label="Remote search" description="Results arrive after 500 ms." className="demo-form">
      <Combobox
        options={results}
        filter={false}
        loading={loading}
        onInputValueChange={setQuery}
        emptyMessage="No countries found"
        placeholder="Start typing"
      />
    </Field>
  );
}

export function CheckboxDemo() {
  return (
    <Stack gap="sm">
      <Checkbox defaultChecked>Email notifications</Checkbox>
      <Checkbox>SMS notifications</Checkbox>
      <Checkbox indeterminate>Select all</Checkbox>
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox color="success" size="lg" defaultChecked>
        Large, success
      </Checkbox>
    </Stack>
  );
}

export function RadioGroupDemo() {
  const [plan, setPlan] = useState<string | null>('pro');
  return (
    <Stack>
      <RadioGroup label="Plan" description={`Value: ${plan}`} value={plan} onValueChange={setPlan} orientation="horizontal">
        <Radio value="free">Free</Radio>
        <Radio value="pro">Pro</Radio>
        <Radio value="team">Team</Radio>
      </RadioGroup>
      <RadioGroup label="Billing" error="Choose how often to pay.">
        <Radio value="monthly">Monthly</Radio>
        <Radio value="yearly">Yearly</Radio>
      </RadioGroup>
    </Stack>
  );
}

export function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <Stack gap="sm">
      <Switch checked={on} onChange={(e) => setOn(e.target.checked)}>
        Notifications {on ? 'on' : 'off'}
      </Switch>
      <Switch color="success" size="lg" defaultChecked>
        Large, success
      </Switch>
      <Switch disabled>Disabled</Switch>
      <Text textStyle="caption" muted>
        A native checkbox with role="switch".
      </Text>
    </Stack>
  );
}

export function SliderDemo() {
  const [volume, setVolume] = useState(40);
  const [price, setPrice] = useState<[number, number]>([200, 800]);
  return (
    <Stack className="demo-form">
      <Field label="Volume" description={`${volume}%`}>
        <Slider value={volume} onValueChange={setVolume} formatValue={(v) => `${v}%`} />
      </Field>
      <Field label="Price" description={`$${price[0]} to $${price[1]}`}>
        <Slider.Range value={price} onValueChange={setPrice} min={0} max={1000} step={50} formatValue={(v) => `$${v}`} />
      </Field>
      <Slider size="sm" color="success" radius="rounded" defaultValue={70} aria-label="Brightness" />
      <Slider size="lg" defaultValue={30} aria-label="Large" />
      <Slider disabled defaultValue={50} aria-label="Disabled" />
    </Stack>
  );
}

const iso = (date: Date | null | undefined) => (date ? format(date, 'yyyy-MM-dd') : 'none');

export function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <Stack className="demo-form">
      <Field label="Appointment" description={`Value: ${iso(date)}`}>
        <DatePicker value={date} onValueChange={setDate} placeholder="Pick a date" />
      </Field>
      <Field label="Large, success">
        <DatePicker size="lg" color="success" radius="lg" placeholder="Pick a date" />
      </Field>
      <DatePicker size="sm" disabled placeholder="Disabled" aria-label="Disabled" />
    </Stack>
  );
}

export function DatePickerRangeDemo() {
  const [stay, setStay] = useState<DateRange | null>(null);
  return (
    <Field label="Stay" description={`From ${iso(stay?.from)} to ${iso(stay?.to)}`} className="demo-form">
      <DatePicker mode="range" value={stay} onValueChange={setStay} placeholder="Check-in and check-out" />
    </Field>
  );
}

export function DatePickerLimitsDemo() {
  const [today] = useState(startOfToday);
  return (
    <Field label="Delivery day" description="Weekdays in the next 30 days." className="demo-form">
      <DatePicker min={addDays(today, 1)} max={addDays(today, 30)} isDateDisabled={isWeekend} placeholder="Pick a weekday" />
    </Field>
  );
}

export function DatePickerLocaleDemo() {
  return (
    <Field label="Termin" description="German locale: week starts on Monday." className="demo-form">
      <DatePicker
        locale={de}
        displayFormat="P"
        placeholder="Datum wählen"
        labels={{ dialog: 'Datum wählen', previousMonth: 'Vorheriger Monat', nextMonth: 'Nächster Monat' }}
      />
    </Field>
  );
}
