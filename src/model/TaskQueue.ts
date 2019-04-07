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
    /** Queues and executes the supplied task.
     * @description First waits for possibly still queued tasks to complete in the sequence they were queued and then
     * calls `executeTask`, waits for the returned promise to settle and then returns the result.
     * @returns The promise returned by `executeTask`.
     */
    public async queue<T>(executeTask: () => Promise<T>) {
        const task = this.executeAfterPrevious(executeTask);
        this.previousTask = task;

        try {
            return await task;
        } finally {
            this.previousTask = Promise.resolve();
        }
    }

    /** Waits for all currently queued tasks to complete. */
    public async idle(): Promise<void> {
        try {
            await this.previousTask;
        // tslint:disable-next-line: no-empty
        } catch {
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private previousTask: Promise<any> = Promise.resolve();

    private async executeAfterPrevious<T>(createTask: () => Promise<T>) {
        await this.idle();

        return createTask();
    }
}
