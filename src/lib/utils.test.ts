import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  cn,
  formatPrice,
  formatPriceWithPeriod,
  slugify,
  truncate,
  buildWhatsAppURL,
  getPropertyPlaceholder,
  timeAgo,
} from "./utils.ts";

describe("formatPrice", () => {
  it("formats millions in full — never truncated to just ₦2", () => {
    assert.equal(formatPrice(2_500_000), "₦2,500,000");
    assert.equal(formatPrice(2_300_000), "₦2,300,000");
  });

  it("formats the prices seen on the live homepage", () => {
    assert.equal(formatPrice(70_000_000), "₦70,000,000");
    assert.equal(formatPrice(8_000_000), "₦8,000,000");
    assert.equal(formatPrice(18_000_000), "₦18,000,000");
    assert.equal(formatPrice(500_000), "₦500,000");
    assert.equal(formatPrice(0), "₦0");
  });
});

describe("formatPriceWithPeriod", () => {
  it("adds /mo and /yr for rentals, nothing for sales", () => {
    assert.equal(formatPriceWithPeriod(500_000, "yearly", "rent"), "₦500,000/yr");
    assert.equal(formatPriceWithPeriod(500_000, "monthly", "rent"), "₦500,000/mo");
    assert.equal(formatPriceWithPeriod(18_000_000, "total", "sale"), "₦18,000,000");
    assert.equal(formatPriceWithPeriod(18_000_000, undefined, "sale"), "₦18,000,000");
  });
});

describe("slugify", () => {
  it("lowercases, strips punctuation and collapses dashes", () => {
    assert.equal(slugify("GRA Oke-Fia"), "gra-oke-fia");
    assert.equal(slugify("5-Bedroom Bungalow, Owode!"), "5-bedroom-bungalow-owode");
    assert.equal(slugify("  Ayekale  "), "ayekale");
  });
});

describe("truncate", () => {
  it("leaves short text alone and ellipsises long text", () => {
    assert.equal(truncate("short", 10), "short");
    assert.equal(truncate("a very long description here", 10), "a very lon...");
  });
});

describe("buildWhatsAppURL", () => {
  it("strips non-digits from the phone and encodes the message", () => {
    const url = buildWhatsAppURL("+234 806 666 1895", "Hello, I want this house");
    assert.equal(
      url,
      "https://wa.me/2348066661895?text=Hello%2C%20I%20want%20this%20house"
    );
  });
});

describe("getPropertyPlaceholder", () => {
  it("returns a photo per type and falls back to house for unknown types", () => {
    assert.match(getPropertyPlaceholder("land"), /^https:\/\/images\.unsplash\.com\//);
    assert.match(getPropertyPlaceholder("shop"), /^https:\/\/images\.unsplash\.com\//);
    assert.equal(getPropertyPlaceholder("castle"), getPropertyPlaceholder("house"));
  });
});

describe("timeAgo", () => {
  it("labels recent and older dates", () => {
    const now = Date.now();
    assert.equal(timeAgo(new Date(now).toISOString()), "just now");
    assert.equal(timeAgo(new Date(now - 5 * 60_000).toISOString()), "5m ago");
    assert.equal(timeAgo(new Date(now - 3 * 3_600_000).toISOString()), "3h ago");
    assert.equal(timeAgo(new Date(now - 2 * 86_400_000).toISOString()), "2d ago");
  });
});

describe("cn", () => {
  it("merges classes and lets the later Tailwind class win", () => {
    assert.equal(cn("px-2 py-1", "px-4"), "py-1 px-4");
    assert.equal(cn("text-gray-400", false && "hidden"), "text-gray-400");
  });
});
