import { dateFormat } from '../utils'
import timezone_mock from "timezone-mock"
describe("dateFormat", () => {
    it("returns all 0 if no offset", () => {
        timezone_mock.register('UTC');
        const date = new Date('2013-02-28T19:00:00+0000')
        expect(dateFormat(date)).toEqual("2013-02-28T19:00:00+0000")
    })
    it("returns positive if positive offset", () => {
        timezone_mock.register('US/Eastern');
        const date = new Date('2013-02-28T19:00:00+0000')
        expect(dateFormat(date)).toEqual("2013-02-28T19:00:00+0500")
    })
    it("returns negative if negative offset", () => {
        timezone_mock.register('Australia/Adelaide');
        const date = new Date('2013-02-28T19:00:00+0000')
        expect(dateFormat(date)).toEqual("2013-02-28T19:00:00-1030")
    })
})