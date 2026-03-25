import { SignIn } from "@clerk/react";

export default function AuthScreen() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100dvh" }}>
            <SignIn />
        </div>
    );
}
