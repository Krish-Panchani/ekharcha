import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ExpenseFormProps = {
    handleSubmit: (e: React.FormEvent) => void;
    setAmount: (amount: string) => void;
    setComment: (comment: string) => void;
    setCategory: (categoryId: number) => void;
    selectedCategory: number; // To manage the currently selected category
};

const expenseCategories = [
    { id: 1, label: "Food & Dining", type: "EXPENSE" },
    { id: 2, label: "Petrol", type: "EXPENSE" },
    { id: 3, label: "Recharge & Bills", type: "EXPENSE" },
    { id: 4, label: "Travelling", type: "EXPENSE" },
    { id: 5, label: "Gift", type: "EXPENSE" },
];

const ExpenseForm = ({
    handleSubmit,
    setAmount,
    setComment,
    setCategory,
    selectedCategory,
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
                <Label htmlFor="category">Category</Label>
                <Select
                    value={selectedCategory.toString()} // Convert number to string for Select
                    onValueChange={(value) => setCategory(Number(value))} // Parse back to number
                >
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {expenseCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                {category.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
    );
};

export default ExpenseForm;
