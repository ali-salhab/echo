import { add } from "@workspace/math/add";
export default function Page() {
    return <div className="flex min-h-svh p-6">{add(2, 3)}</div>;
}
