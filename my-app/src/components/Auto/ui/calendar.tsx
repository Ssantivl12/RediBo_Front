import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={className}
            classNames={{
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4',
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'text-sm font-medium',
            nav: 'space-x-1 flex items-center',
            nav_button: 'h-7 w-7 bg-white text-black hover:bg-gray-100 p-0 rounded-md',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
            row: 'flex w-full mt-2',
            cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100',
            day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
            day_selected: 'bg-[#fca311] text-white hover:bg-[#e69500]',
            day_today: 'bg-gray-100',
            ...classNames,
            }}
        {...props}
        />
    );
}

export { Calendar };