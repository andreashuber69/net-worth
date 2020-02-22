// Copyright (C) 2018-2019 Andreas Huber Dönni
//
// This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
// License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
// warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with this program. If not, see
// <http://www.gnu.org/licenses/>.

/** Provides the means to execute tasks strictly sequentially. */
export class TaskQueue {
    /**
     * Queues and executes the supplied task.
     * @description First waits for possibly still queued tasks to complete in the sequence they were queued and then
     * calls `executeTask`, waits for the returned promise to settle and then returns the result.
     * @returns The promise returned by `executeTask`.
     */
    public async queue<T>(executeTask: () => Promise<T>) {
        const current = this.executeAfterPrevious(executeTask);
        this.previous = current;

        try {
            return await current;
        } finally {
            // The following condition can only be true if no other task has been queued while we've been waiting for
            // current to settle. IOW, current was the last task in the queue and the queue is now empty.
            if (this.previous === current) {
                // Without the following statement, continued use of a TaskQueue object would create a memory leak in
                // the sense that no involved promise would ever be eligible for GC, because the current promise would
                // always reference the previous promise, which in turn would reference the promise before the previous
                // promise and so on. Here, we break that chain when the queue becomes empty.
                this.previous = Promise.resolve();
            }
        }
    }

    /** Waits for all currently queued tasks to complete. */
    public async idle(): Promise<void> {
        try {
            await this.previous;
        // eslint-disable-next-line no-empty
        } catch {
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private previous: Promise<any> = Promise.resolve();

    private async executeAfterPrevious<T>(createTask: () => Promise<T>) {
        await this.idle();

        return createTask();
    }
}
