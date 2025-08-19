import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useFormState } from "react-hook-form";
import { LuCircleAlert } from "react-icons/lu";

type ErrorMessageProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  children?: (message: string) => React.ReactNode;
};

export const ValidationError = <T extends FieldValues>({
  name,
  control,
  children,
}: ErrorMessageProps<T>) => {
  const { errors } = useFormState({ control, name });
  const error = errors[name]?.message as string;

  if (!error) return null;

  return (
    <div className="mt-1 text-sm text-red-600">
      {children ? children(error) : (
        <div className="flex items-center gap-2">
          <LuCircleAlert className="flex-shrink-0 w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};