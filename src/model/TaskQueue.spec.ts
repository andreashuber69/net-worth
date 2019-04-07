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

const randomDelay = () =>
    new Promise<number>((resolve) => {
        const milliseconds = Math.random() * 800 + 200;
        setTimeout(() => resolve(milliseconds), milliseconds);
    });

const precision = -1;

fdescribe(TaskQueue.name, () => {
    describe("queue", () => {
        it("should execute tasks sequentially", async () => {
            const sut = new TaskQueue();
            const start = Date.now();
            const firstTask = sut.queue(randomDelay);
            const secondTask = sut.queue(randomDelay);
            const thirdTask = sut.queue(randomDelay);
            const firstDelay = await firstTask;
            expect(Date.now() - start).toBeCloseTo(firstDelay, precision);
            const secondDelay = await secondTask;
            expect(Date.now() - start).toBeCloseTo(firstDelay + secondDelay, precision);
            const thirdDelay = await thirdTask;
            expect(Date.now() - start).toBeCloseTo(firstDelay + secondDelay + thirdDelay, precision);
        });
    });

    describe("idle", () => {
        it("should only complete when all tasks have completed", async () => {
            const sut = new TaskQueue();
            const start = Date.now();
            const firstTask = sut.queue(randomDelay);
            const secondTask = sut.queue(randomDelay);
            const thirdTask = sut.queue(randomDelay);
            await sut.idle();
            const actualTotalDelay = Date.now() - start;
            const totalDelay = await firstTask + await secondTask + await thirdTask;
            expect(Date.now() - start).toBeCloseTo(actualTotalDelay);
            expect(actualTotalDelay).toBeCloseTo(totalDelay, precision);
        });
    });
});
