import {describe, expect, it} from '@jest/globals';
import { similarity } from "../src/Similarity";

describe("similarity", () => {
    it("should return a number", () => {
        const result = similarity("hello", "hello");
        expect(typeof result).toBe("number");
    });

    it("should return 1 for identical strings", () => {
        const result = similarity("hello", "hello");
        expect(result).toBe(1);
    });

    it("should return a value between 0 and 1 for similar strings", () => {
        const result = similarity("hello", "hell");
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(1);
    });

    it("should handle empty strings", () => {
        const result = similarity("", "");
        expect(result).toBe(1);
    });

    it("should handle strings of different lengths", () => {
        const result = similarity("hello", "hellooo");
        expect(result).toBeLessThan(1);
    });

    it("should handle special characters", () => {
        const result = similarity("hello!", "hello@");
        expect(result).toBeLessThan(1);
    });

    it("should handle case sensitivity", () => {
        const result = similarity("Hello", "hello");
        expect(result).toBeLessThan(1);
    });

    it("should return a value between 0 and 1 if the first word is longer", () => {
        const result = similarity("hello", "hell");
        expect(result).toBeLessThan(1);
    });

    it("should return a value between 0 and 1 if the second word is longer", () => {
        const result = similarity("hell", "hello");
        expect(result).toBeLessThan(1);
    });
});
