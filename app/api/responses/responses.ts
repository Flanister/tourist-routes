import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendError = (data: any = "Ошибка!") => {
    return NextResponse.json({
        status: "error",
        error: true,
        data: data
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendSuccess = (data: any = "Успех!") => {
    return NextResponse.json({
        status: "success",
        success: true,
        data: data
    });
};
