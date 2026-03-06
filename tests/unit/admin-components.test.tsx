import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import ModeSelector from "@/components/admin/ModeSelector"
import LengthSelector from "@/components/admin/LengthSelector"
import StatsWidget from "@/components/admin/StatsWidget"
import SocialPlatformCard from "@/components/admin/SocialPlatformCard"

afterEach(cleanup)

describe("ModeSelector", () => {
  it("renders 3 modes", () => {
    render(<ModeSelector value="libre" onChange={() => {}} />)
    expect(screen.getByText("Libre")).toBeDefined()
    expect(screen.getByText("Assiste")).toBeDefined()
    expect(screen.getByText("Genere")).toBeDefined()
  })

  it("calls onChange with correct mode", () => {
    const onChange = vi.fn()
    render(<ModeSelector value="libre" onChange={onChange} />)
    fireEvent.click(screen.getByText("Assiste"))
    expect(onChange).toHaveBeenCalledWith("assiste")
  })
})

describe("LengthSelector", () => {
  it("renders 3 lengths", () => {
    render(<LengthSelector value="medium" onChange={() => {}} />)
    expect(screen.getByText("Court")).toBeDefined()
    expect(screen.getByText("Moyen")).toBeDefined()
    expect(screen.getByText("Long")).toBeDefined()
  })

  it("returns the correct value on click", () => {
    const onChange = vi.fn()
    render(<LengthSelector value="medium" onChange={onChange} />)
    fireEvent.click(screen.getByText("Long"))
    expect(onChange).toHaveBeenCalledWith("long")
  })
})

describe("StatsWidget", () => {
  it("displays label and value", () => {
    render(<StatsWidget label="Articles" value={42} />)
    expect(screen.getByText("Articles")).toBeDefined()
    expect(screen.getByText("42")).toBeDefined()
  })
})

describe("SocialPlatformCard", () => {
  it("displays content and copy button", () => {
    render(
      <SocialPlatformCard
        platform="TWITTER"
        content="Tweet de test"
        articleUrl="https://example.com/blog/test"
        onRegenerate={() => {}}
      />
    )
    expect(screen.getByText("Twitter / X")).toBeDefined()
    expect(screen.getByDisplayValue("Tweet de test")).toBeDefined()
    expect(screen.getByText("Copier")).toBeDefined()
  })

  it("displays share button for supported platforms", () => {
    render(
      <SocialPlatformCard
        platform="TWITTER"
        content="Tweet"
        articleUrl="https://example.com"
        onRegenerate={() => {}}
      />
    )
    expect(screen.getByText("Copier & ouvrir")).toBeDefined()
  })

  it("does not display share button for Instagram", () => {
    render(
      <SocialPlatformCard
        platform="INSTAGRAM"
        content="Post insta"
        articleUrl="https://example.com"
        onRegenerate={() => {}}
      />
    )
    expect(screen.queryByText("Copier & ouvrir")).toBeNull()
  })
})
