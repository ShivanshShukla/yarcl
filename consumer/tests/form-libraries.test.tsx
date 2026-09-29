import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { useState } from 'react';
import { Controller, useForm as useRHF } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm as useTanStackForm } from '@tanstack/react-form';
import {
  Checkbox,
  Combobox,
  Field,
  Input,
  NumberInput,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Switch,
} from '@yarcl/react';
import { page } from '../../test-utils/page';

const selectOptions = [
  { value: 'free', label: 'Free Plan' },
  { value: 'pro', label: 'Pro Plan' },
  { value: 'enterprise', label: 'Enterprise Plan' },
];

const comboboxOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
];

describe('Form Libraries Integration', () => {
  describe('React Hook Form', () => {
    it('supports controlled binding with Controller', async () => {
      let submittedData: Record<string, unknown> | null = null;

      function RHFControlledForm() {
        const { control, handleSubmit } = useRHF({
          defaultValues: {
            plan: 'pro',
            country: 'ca',
            frequency: 'monthly',
            notifications: true,
          },
        });

        return (
          <form onSubmit={handleSubmit((data) => { submittedData = data; })}>
            <Controller
              name="plan"
              control={control}
              render={({ field }) => (
                <Field label="Plan">
                  <Select
                    options={selectOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Field>
              )}
            />

            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Field label="Country">
                  <Combobox
                    options={comboboxOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Field>
              )}
            />

            <Controller
              name="frequency"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="Billing Frequency"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <Radio value="monthly">Monthly</Radio>
                  <Radio value="annual">Annual</Radio>
                </RadioGroup>
              )}
            />

            <Controller
              name="notifications"
              control={control}
              render={({ field }) => (
                <Field label="Notifications">
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    Enable Notifications
                  </Switch>
                </Field>
              )}
            />

            <button type="submit">Submit</button>
          </form>
        );
      }

      const screen = await render(<RHFControlledForm />);
      const submitBtn = screen.getByRole('button', { name: 'Submit' });
      await submitBtn.click();

      expect(submittedData).toEqual({
        plan: 'pro',
        country: 'ca',
        frequency: 'monthly',
        notifications: true,
      });
    });

    it('supports uncontrolled binding with native FormData submit & hidden inputs', async () => {
      let submittedData: Record<string, unknown> | null = null;

      function RHFUncontrolledForm() {
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              submittedData = Object.fromEntries(formData.entries());
            }}
          >
            <Field label="Plan">
              <Select
                name="plan"
                defaultValue="free"
                options={selectOptions}
              />
            </Field>

            <Field label="Country">
              <Combobox
                name="country"
                defaultValue="us"
                options={comboboxOptions}
              />
            </Field>

            <RadioGroup label="Frequency" name="frequency" defaultValue="annual">
              <Radio value="monthly">Monthly</Radio>
              <Radio value="annual">Annual</Radio>
            </RadioGroup>

            <Field label="Notifications">
              <Switch name="notifications" value="yes" defaultChecked>
                Enable Notifications
              </Switch>
            </Field>

            <button type="submit">Submit</button>
          </form>
        );
      }

      const screen = await render(<RHFUncontrolledForm />);
      const submitBtn = screen.getByRole('button', { name: 'Submit' });
      await submitBtn.click();

      expect(submittedData).toEqual({
        plan: 'free',
        country: 'us',
        frequency: 'annual',
        notifications: 'yes',
      });
    });

    it('maps validation errors to Field error and sets aria-invalid', async () => {
      function RHFValidationForm() {
        const { control, handleSubmit, setError } = useRHF({
          defaultValues: { plan: null, country: null, frequency: null, notifications: false },
        });

        return (
          <form onSubmit={handleSubmit(() => {
            setError('plan', { type: 'required', message: 'Plan is required' });
            setError('country', { type: 'required', message: 'Country is required' });
            setError('frequency', { type: 'required', message: 'Frequency is required' });
            setError('notifications', { type: 'required', message: 'Must accept terms' });
          })}>
            <Controller
              name="plan"
              control={control}
              render={({ field, fieldState }) => (
                <Field label="Plan" error={fieldState.error?.message}>
                  <Select
                    options={selectOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Field>
              )}
            />

            <Controller
              name="country"
              control={control}
              render={({ field, fieldState }) => (
                <Field label="Country" error={fieldState.error?.message}>
                  <Combobox
                    options={comboboxOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Field>
              )}
            />

            <Controller
              name="frequency"
              control={control}
              render={({ field, fieldState }) => (
                <RadioGroup
                  label="Frequency"
                  value={field.value}
                  onValueChange={field.onChange}
                  error={fieldState.error?.message}
                >
                  <Radio value="monthly">Monthly</Radio>
                </RadioGroup>
              )}
            />

            <Controller
              name="notifications"
              control={control}
              render={({ field, fieldState }) => (
                <Field label="Notifications" error={fieldState.error?.message}>
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    Notifications
                  </Switch>
                </Field>
              )}
            />

            <button type="submit">Validate</button>
          </form>
        );
      }

      const screen = await render(<RHFValidationForm />);
      await screen.getByRole('button', { name: 'Validate' }).click();

      expect(screen.getByText('Plan is required')).toBeTruthy();
      expect(screen.getByText('Country is required')).toBeTruthy();
      expect(screen.getByText('Frequency is required')).toBeTruthy();
      expect(screen.getByText('Must accept terms')).toBeTruthy();

      const selectBtn = document.querySelector('button.yarcl-select');
      expect(selectBtn?.getAttribute('aria-invalid')).toBe('true');

      const comboboxInput = document.querySelector('input.yarcl-combobox');
      expect(comboboxInput?.getAttribute('aria-invalid')).toBe('true');

      const switchInput = document.querySelector('input.yarcl-switch-input');
      expect(switchInput?.getAttribute('aria-invalid')).toBe('true');
    });

    it('validates with Zod schema via zodResolver and updates on valid submit', async () => {
      const formSchema = z.object({
        accountName: z.string().min(3, 'Account name must be at least 3 characters'),
        plan: z.string().min(1, 'Plan selection is required'),
        country: z.string().min(1, 'Country is required'),
        frequency: z.enum(['monthly', 'annual'], {
          message: 'Please select a billing frequency',
        }),
        seats: z.number().min(1, 'Must have at least 1 seat').max(10, 'Maximum 10 seats allowed'),
        agree: z.literal(true, {
          message: 'You must agree to the terms',
        }),
      });

      type FormValues = z.infer<typeof formSchema>;
      let submittedData: FormValues | null = null;

      function RHFZodForm() {
        const { control, handleSubmit } = useRHF<FormValues>({
          resolver: zodResolver(formSchema),
          defaultValues: {
            accountName: 'Ab',
            plan: '',
            country: '',
            frequency: undefined as unknown as 'monthly',
            seats: 0,
            agree: false as unknown as true,
          },
        });

        return (
          <form onSubmit={handleSubmit((data) => { submittedData = data; })}>
            <Controller
              name="accountName"
              control={control}
              render={({ field, fieldState }) => (
                <Field label="Account Name" error={fieldState.error?.message}>
                  <Input {...field} placeholder="Organization or name" />
                </Field>
              )}
            />

            <Controller
              name="plan"
              control={control}
              render={({ field, fieldState }) => (
                <Field label="Plan" error={fieldState.error?.message}>
                  <Select
                    options={selectOptions}
                    value={field.value || null}
                    onValueChange={(v) => field.onChange(v ?? '')}
                  />
                </Field>
              )}
            />

            <Controller
              name="country"
              control={control}
              render={({ field, fieldState }) => (
                <Field label="Country" error={fieldState.error?.message}>
                  <Combobox
                    options={comboboxOptions}
                    value={field.value || null}
                    onValueChange={(v) => field.onChange(v ?? '')}
                  />
                </Field>
              )}
            />

            <Controller
              name="frequency"
              control={control}
              render={({ field, fieldState }) => (
                <RadioGroup
                  label="Billing Frequency"
                  value={field.value ?? null}
                  onValueChange={field.onChange}
                  error={fieldState.error?.message}
                >
                  <Radio value="monthly">Monthly</Radio>
                  <Radio value="annual">Annual</Radio>
                </RadioGroup>
              )}
            />

            <Controller
              name="seats"
              control={control}
              render={({ field, fieldState }) => (
                <Field label="Seats" error={fieldState.error?.message}>
                  <NumberInput
                    value={field.value}
                    onValueChange={(val) => field.onChange(val ?? 0)}
                  />
                </Field>
              )}
            />

            <Controller
              name="agree"
              control={control}
              render={({ field, fieldState }) => (
                <Field label="Terms" error={fieldState.error?.message}>
                  <Switch
                    checked={Boolean(field.value)}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    I agree
                  </Switch>
                </Field>
              )}
            />

            <button type="submit">Submit Zod</button>
          </form>
        );
      }

      const screen = await render(<RHFZodForm />);
      await screen.getByRole('button', { name: 'Submit Zod' }).click();

      // Check validation error messages
      expect(screen.getByText('Account name must be at least 3 characters')).toBeTruthy();
      expect(screen.getByText('Plan selection is required')).toBeTruthy();
      expect(screen.getByText('Country is required')).toBeTruthy();
      expect(screen.getByText('Please select a billing frequency')).toBeTruthy();
      expect(screen.getByText('Must have at least 1 seat')).toBeTruthy();
      expect(screen.getByText('You must agree to the terms')).toBeTruthy();
      expect(submittedData).toBeNull();
    });

    it('handles programmatic form reset and error clearing with RHF', async () => {
      const initialValues = {
        plan: 'free',
        country: 'us',
        seats: 2,
        notifications: false,
      };

      function RHFResetForm() {
        const { control, handleSubmit, reset } = useRHF({
          defaultValues: initialValues,
        });

        return (
          <form onSubmit={handleSubmit(() => {})}>
            <Controller
              name="plan"
              control={control}
              render={({ field, fieldState }) => (
                <Field label="Plan" error={fieldState.error?.message}>
                  <Select
                    options={selectOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Field>
              )}
            />

            <Controller
              name="country"
              control={control}
              render={({ field, fieldState }) => (
                <Field label="Country" error={fieldState.error?.message}>
                  <Combobox
                    options={comboboxOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Field>
              )}
            />

            <Controller
              name="seats"
              control={control}
              render={({ field }) => (
                <Field label="Seats">
                  <NumberInput
                    value={field.value}
                    onValueChange={(v) => field.onChange(v ?? 0)}
                  />
                </Field>
              )}
            />

            <Controller
              name="notifications"
              control={control}
              render={({ field }) => (
                <Field label="Notifications">
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    Notifications
                  </Switch>
                </Field>
              )}
            />

            <button
              type="button"
              onClick={() =>
                reset({
                  plan: 'enterprise',
                  country: 'mx',
                  seats: 8,
                  notifications: true,
                })
              }
            >
              Reset to New
            </button>
            <button type="button" onClick={() => reset(initialValues)}>
              Reset to Default
            </button>
          </form>
        );
      }

      const screen = await render(<RHFResetForm />);

      // Initially default values
      expect(screen.getByText('Free Plan')).toBeTruthy();
      const seatsInput = document.querySelector('input.yarcl-number-input-field') as HTMLInputElement;
      expect(seatsInput.value).toBe('2');

      // Reset to new values
      await screen.getByRole('button', { name: 'Reset to New' }).click();
      expect(screen.getByText('Enterprise Plan')).toBeTruthy();
      expect(seatsInput.value).toBe('8');

      // Reset back to initial default values
      await screen.getByRole('button', { name: 'Reset to Default' }).click();
      expect(screen.getByText('Free Plan')).toBeTruthy();
      expect(seatsInput.value).toBe('2');
    });
  });

  describe('TanStack Form', () => {
    it('supports controlled bindings and error mapping', async () => {
      let submittedValues: Record<string, unknown> | null = null;

      function TanStackFormWrapper() {
        const form = useTanStackForm({
          defaultValues: {
            plan: 'free',
            country: 'us',
            frequency: 'monthly',
            agree: false,
          },
          onSubmit: ({ value }) => {
            submittedValues = value;
          },
        });

        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="plan"
              validators={{
                onChange: ({ value }) => (!value ? 'Plan required' : undefined),
              }}
              children={(field) => (
                <Field label="Plan" error={field.state.meta.errors.join(', ')}>
                  <Select
                    name={field.name}
                    options={selectOptions}
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val ?? '')}
                  />
                </Field>
              )}
            />

            <form.Field
              name="country"
              children={(field) => (
                <Field label="Country">
                  <Combobox
                    name={field.name}
                    options={comboboxOptions}
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val ?? '')}
                  />
                </Field>
              )}
            />

            <form.Field
              name="frequency"
              children={(field) => (
                <RadioGroup
                  label="Frequency"
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val)}
                >
                  <Radio value="monthly">Monthly</Radio>
                  <Radio value="annual">Annual</Radio>
                </RadioGroup>
              )}
            />

            <form.Field
              name="agree"
              children={(field) => (
                <Field label="Terms">
                  <Switch
                    name={field.name}
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  >
                    Agree to terms
                  </Switch>
                </Field>
              )}
            />

            <button type="submit">Submit TanStack</button>
          </form>
        );
      }

      const screen = await render(<TanStackFormWrapper />);
      await screen.getByRole('button', { name: 'Submit TanStack' }).click();

      expect(submittedValues).toEqual({
        plan: 'free',
        country: 'us',
        frequency: 'monthly',
        agree: false,
      });
    });

    it('supports Standard Schema / Zod field validation in TanStack Form', async () => {
      const emailSchema = z.string().email('Invalid email address');
      const planSchema = z.string().min(1, 'Plan selection is required');

      let submittedValues: Record<string, unknown> | null = null;

      function TanStackStandardSchemaForm() {
        const form = useTanStackForm({
          defaultValues: {
            email: 'invalid-email',
            plan: '',
          },
          onSubmit: ({ value }) => {
            submittedValues = value;
          },
        });

        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="email"
              validators={{
                onChange: emailSchema,
                onSubmit: emailSchema,
              }}
              children={(field) => {
                const errorMsg = field.state.meta.errors
                  .map((err) => (typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message) : String(err)))
                  .filter(Boolean)
                  .join(', ');
                return (
                  <Field label="Email" error={errorMsg || undefined}>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                );
              }}
            />

            <form.Field
              name="plan"
              validators={{
                onChange: planSchema,
                onSubmit: planSchema,
              }}
              children={(field) => {
                const errorMsg = field.state.meta.errors
                  .map((err) => (typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message) : String(err)))
                  .filter(Boolean)
                  .join(', ');
                return (
                  <Field label="Plan" error={errorMsg || undefined}>
                    <Select
                      name={field.name}
                      options={selectOptions}
                      value={field.state.value || null}
                      onValueChange={(val) => field.handleChange(val ?? '')}
                    />
                  </Field>
                );
              }}
            />

            <button type="submit">Submit Standard Schema</button>
            <button type="button" onClick={() => form.reset()}>Reset TanStack</button>
          </form>
        );
      }

      const screen = await render(<TanStackStandardSchemaForm />);
      await screen.getByRole('button', { name: 'Submit Standard Schema' }).click();

      expect(screen.getByText('Invalid email address')).toBeTruthy();
      expect(screen.getByText('Plan selection is required')).toBeTruthy();
      expect(submittedValues).toBeNull();
    });
  });

  describe('Native Form Reset Lifecycle', () => {
    it('resets uncontrolled yarcl components when HTML form reset is triggered', async () => {
      function UncontrolledNativeResetForm() {
        return (
          <form id="test-native-form">
            <Field label="Plan">
              <Select
                name="plan"
                defaultValue="pro"
                options={selectOptions}
              />
            </Field>

            <Field label="Country">
              <Combobox
                name="country"
                defaultValue="ca"
                options={comboboxOptions}
              />
            </Field>

            <RadioGroup label="Billing" name="frequency" defaultValue="annual">
              <Radio value="monthly">Monthly</Radio>
              <Radio value="annual">Annual</Radio>
            </RadioGroup>

            <Field label="Seats">
              <NumberInput
                name="seats"
                defaultValue={5}
                min={1}
                max={20}
              />
            </Field>

            <Field label="Volume">
              <Slider
                name="volume"
                defaultValue={40}
                min={0}
                max={100}
                aria-label="Volume Slider"
              />
            </Field>

            <Field label="Notifications">
              <Switch name="notifications" defaultChecked>
                Enable Notifications
              </Switch>
            </Field>

            <button type="reset">Reset Native</button>
          </form>
        );
      }

      const screen = await render(<UncontrolledNativeResetForm />);

      // Initial state checks
      expect(screen.getByText('Pro Plan')).toBeTruthy();
      const comboboxInput = document.querySelector('input.yarcl-combobox') as HTMLInputElement;
      expect(comboboxInput.value).toBe('Canada');

      const seatsInput = document.querySelector('input.yarcl-number-input-field') as HTMLInputElement;
      expect(seatsInput.value).toBe('5');

      const switchInput = document.querySelector('input.yarcl-switch-input') as HTMLInputElement;
      expect(switchInput.checked).toBe(true);

      // Now change uncontrolled select: click select button and choose Enterprise
      const selectBtn = document.querySelector('button.yarcl-select') as HTMLButtonElement;
      await selectBtn.click();
      const enterpriseOption = screen.getByText('Enterprise Plan');
      await enterpriseOption.click();
      expect(screen.getByText('Enterprise Plan')).toBeTruthy();

      // Trigger native form reset via the reset button
      const resetBtn = screen.getByRole('button', { name: 'Reset Native' });
      await resetBtn.click();

      // Verify Select restored defaultValue ("Pro Plan")
      expect(screen.getByText('Pro Plan')).toBeTruthy();
      // Verify NumberInput restored defaultValue ("5")
      expect(seatsInput.value).toBe('5');
      // Verify Switch restored defaultChecked (true)
      expect(switchInput.checked).toBe(true);
    });
  });
});

