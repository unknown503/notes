import PasskeyForm from "@/components/auth/PasskeyForm"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast";
import { customToast } from "@/lib/utils";

export function PasskeyDialog() {
  const savePasskey = async (passkey: string) => {
    const res = await fetch('/api/passkey', {
      method: 'PUT',
      body: JSON.stringify({ passkey }),
    });

    const json = await res.json()
    if (!json.success) {
      console.error(json.error)
      toast(customToast(json.error, true))
    }else{
      toast(customToast("Passkey changed"))
    }
  }

  return (
    <DialogContent className="sm:max-w-[26.5625rem]">
      <DialogHeader>
        <DialogTitle className="sr-only">Passkey</DialogTitle>
        <DialogDescription className="sr-only">
          Passkey
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-5 my-6">
        <PasskeyForm onSubmit={savePasskey} />
      </div>
    </DialogContent>
  )
}
