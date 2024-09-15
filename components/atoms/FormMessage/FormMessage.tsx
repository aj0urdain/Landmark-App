export type Message = {
  success?: string;
  error?: string;
  message?: string;
  otp?: string;
};

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className='flex flex-col gap-2 w-full max-w-md text-xs'>
      {message.success && (
        <div className='text-foreground border-l-2 border-foreground px-4'>
          {message.success}
        </div>
      )}
      {message.error && (
        <div className='text-destructive-foreground border-l-2 border-destructive-foreground px-4'>
          {message.error}
        </div>
      )}
      {message.message && (
        <div className='text-foreground border-l-2 px-4'>{message.message}</div>
      )}
      {message.otp == 'sent' && (
        <div className='text-foreground border-l-2 border-foreground px-4'>
          Check your email for the login link or OTP.
        </div>
      )}
    </div>
  );
}
