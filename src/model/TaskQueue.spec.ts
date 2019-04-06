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

import { TaskQueue } from "./TaskQueue";

const delay = (milliseconds: number) =>
    new Promise<number>((resolve) => setTimeout(() => resolve(milliseconds), milliseconds));

describe(TaskQueue.name, () => {
    describe("queue", () => {
        it("should execute tasks sequentially", async () => {
            const sut = new TaskQueue();
            const start = Date.now();
            const firstTask = sut.queue(() => delay(500));
            const secondTask = sut.queue(() => delay(1000));
            const thirdTask = sut.queue(() => delay(1500));
            const firstDelay = await firstTask;
            expect(Date.now() - start).toBeCloseTo(firstDelay, -2);
            const secondDelay = await secondTask;
            expect(Date.now() - start).toBeCloseTo(firstDelay + secondDelay, -2);
            const thirdDelay = await thirdTask;
            expect(Date.now() - start).toBeCloseTo(firstDelay + secondDelay + thirdDelay, -2);
        });
    });
});
