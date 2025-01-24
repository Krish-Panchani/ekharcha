import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ExpenseFormProps = {
    handleSubmit: (e: React.FormEvent) => void;
    setAmount: (amount: string) => void;
    setComment: (comment: string) => void;

}

const ExpenseForm = ({
    handleSubmit,
    setAmount,
    setComment,
}: ExpenseFormProps) => {
    return (
        <form onSubmit={handleSubmit} className="grid items-start gap-4 px-4">
            <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                    type="number"
                    id="amount"
                    placeholder="Enter amount"
                    required
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                    id="comment"
                    placeholder="Optional comment"
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>


            <Button type="submit">Submit Expense</Button>
        </form>
    )
}

export default ExpenseForm;