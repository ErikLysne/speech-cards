import {
  Document,
  Page,
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer";
import { DownloadIcon, InfoIcon, PlusIcon, XIcon } from "lucide-react";
import React from "react";
import { PDFCard } from "~/components/pdf/pdf-card";
import { ModeToggle } from "~/components/theme/mode-toggle";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import { KoFiButton } from "~/components/utils/ko-fi-button";
import type { SpeechCard } from "~/types/speech-card";
import { ClientOnly } from "~/utils/client-only";
import { useDebounce } from "~/utils/use-debounce";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Speech cards" },
    {
      name: "description",
      content: "Create printable cards for your speech for free",
    },
  ];
}

export default function Home() {
  const [cards, setCards] = React.useState<SpeechCard[]>([
    {
      id: crypto.randomUUID(),
      title: "Introduction",
      content: "Welcome everyone! We are gathered here today to...",
    },
  ]);

  const [showCutLines, setShowCutLines] = React.useState(true);
  const [showCardNumbers, setShowCardNumbers] = React.useState(true);
  const [showBorder, setShowBorder] = React.useState(true);
  const [borderStyle, setBorderStyle] = React.useState<1 | 2 | 3>(1);
  const [cardsPerPage, setCardsPerPage] = React.useState(4);
  const [showToolbar, setShowToolbar] = React.useState(true);

  function addCard() {
    setCards([
      ...cards,
      {
        id: crypto.randomUUID(),
        title: "",
        content: "",
      },
    ]);
  }

  function removeCard(id: string) {
    setCards((cards) => cards.filter((card) => card.id !== id));
  }

  function updateCard(id: string, updatedCard: SpeechCard) {
    setCards((cards) =>
      cards.map((card) => (card.id === id ? updatedCard : card))
    );
  }

  function updateCardsPerPage(value: number) {
    if (value < 1) {
      setCardsPerPage(1);
    } else if (value > 8) {
      setCardsPerPage(8);
    } else {
      setCardsPerPage(value);
    }
  }

  const pdfInputs = React.useMemo(
    () => ({
      cards,
      showCutLines,
      showCardNumbers,
      showBorder,
      borderStyle,
      cardsPerPage,
      showToolbar,
    }),
    [
      cards,
      showCutLines,
      showCardNumbers,
      showBorder,
      borderStyle,
      cardsPerPage,
      showToolbar,
    ]
  );

  const debouncedPdfInputs = useDebounce(pdfInputs);

  const PDFDocument = React.useMemo(() => {
    const {
      cards: dCards,
      showCutLines: dShowCutLines,
      showCardNumbers: dShowCardNumbers,
      showBorder: dShowBorder,
      borderStyle: dBorderStyle,
      cardsPerPage: dCardsPerPage,
    } = debouncedPdfInputs;

    return (
      <Document key={Date.now()}>
        <Page size="A4">
          {dCards.map((card, index) => (
            <PDFCard
              key={card.id}
              card={card}
              showCutLine={dShowCutLines}
              showCardNumber={dShowCardNumbers}
              cardNumber={index + 1}
              cardTotal={dCards.length}
              height={`${100 / dCardsPerPage}%`}
              showBorder={dShowBorder}
              borderStyle={dBorderStyle}
            />
          ))}
        </Page>
      </Document>
    );
  }, [debouncedPdfInputs]);

  return (
    <div className="min-h-screen py-2 px-2 md:py-8 md:px-8 lg:px-16 mx-auto">
      <div className="flex justify-between flex-col md:flex-row gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">Speech cards</h1>
          <p>Turn your speech into printable cards for free</p>
        </div>

        <div className="flex gap-2">
          <KoFiButton />

          <Dialog>
            <Button variant="ghost" asChild>
              <DialogTrigger>
                <InfoIcon />
                About
              </DialogTrigger>
            </Button>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>About speechcards.app</DialogTitle>
                <DialogDescription className="space-y-4">
                  <span className="block text-left">
                    This is a free tool to help you transform your next speech
                    into printable cards.
                  </span>

                  <span className="block text-left">
                    Simply add your speech content to the cards, customize the
                    design, and download the generated PDF. Then use a pair of
                    scissors to cut out the cards and you're ready to go!
                  </span>

                  <span className="block text-left">
                    Perfect for occasions like weddings, conferences, or any
                    public speaking event.
                  </span>

                  <span className="block text-left">
                    Runs entirely in your browser. Your data is never sent
                    anywhere and is deleted when you close the tab.
                  </span>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <ModeToggle />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mx-auto">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              Cards{" "}
              <span
                className="text-sm text-gray-500"
                aria-label={`${cards.length} cards`}
              >{`(${cards.length})`}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 md:px-4">
            <ScrollArea className="h-[400]px lg:h-[100vh] w-full">
              <div className="flex flex-col gap-2">
                {cards.length > 0 ? (
                  cards.map((card, index) => (
                    <Card key={card.id} className="w-full">
                      <CardHeader>
                        <CardTitle>{`Card ${index + 1}`}</CardTitle>
                        <CardAction>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCard(card.id)}
                          >
                            <XIcon />
                          </Button>
                        </CardAction>
                      </CardHeader>
                      <CardContent>
                        <Input
                          className="mb-4"
                          placeholder="Card title"
                          value={card.title}
                          onChange={(e) =>
                            updateCard(card.id, {
                              ...card,
                              title: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Card content"
                          className="h-24 resize-vertical"
                          value={card.content}
                          onChange={(e) =>
                            updateCard(card.id, {
                              ...card,
                              content: e.target.value,
                            })
                          }
                        />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500 h-24 flex items-center justify-center">
                    No cards yet. Add one!
                  </p>
                )}

                <Button variant="outline" onClick={addCard}>
                  <PlusIcon /> Add Card
                </Button>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <CardTitle>Generated PDF</CardTitle>

            <CardAction className="w-full sm:w-auto">
              <ClientOnly
                fallback={
                  <Button
                    variant="default"
                    disabled
                    className="w-full sm:w-auto"
                  >
                    <DownloadIcon />
                    Download PDF
                  </Button>
                }
              >
                {cards.length === 0 ? (
                  <Button
                    variant="default"
                    disabled
                    className="w-full sm:w-auto"
                  >
                    <DownloadIcon />
                    Download PDF
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <PDFDownloadLink
                      key={JSON.stringify(debouncedPdfInputs)}
                      document={PDFDocument}
                      fileName="speech-cards.pdf"
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2"
                    >
                      <DownloadIcon />
                      Download PDF
                    </PDFDownloadLink>
                  </Button>
                )}
              </ClientOnly>
            </CardAction>
          </CardHeader>
          <CardContent className="overflow-auto">
            <div className="mt-2 mb-4 flex flex-col">
              <p className="mb-2 text-sm">Customize card design:</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="showCutLines"
                    checked={showCutLines}
                    onCheckedChange={(checked) =>
                      setShowCutLines(checked === true)
                    }
                  />
                  <Label htmlFor="showCutLines">Include cut lines</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="showCardNumbers"
                    checked={showCardNumbers}
                    onCheckedChange={(checked) =>
                      setShowCardNumbers(checked === true)
                    }
                  />
                  <Label htmlFor="showCardNumbers">Include card numbers</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="showBorder"
                    checked={showBorder}
                    onCheckedChange={(checked) =>
                      setShowBorder(checked === true)
                    }
                  />
                  <Label htmlFor="showBorder">Include border</Label>
                </div>

                <Select
                  value={String(borderStyle)}
                  onValueChange={(value) =>
                    setBorderStyle(Number(value) as 1 | 2 | 3)
                  }
                  disabled={!showBorder}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Border style" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="1">Border style 1</SelectItem>
                    <SelectItem value="2">Border style 2</SelectItem>
                    <SelectItem value="3">Border style 3</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Label htmlFor="cardsPerPage">Cards per page:</Label>
                  <Input
                    id="cardsPerPage"
                    type="number"
                    min={1}
                    max={8}
                    value={cardsPerPage}
                    onChange={(e) => updateCardsPerPage(Number(e.target.value))}
                    className="w-16"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4 flex flex-col">
              <p className="mb-2 text-sm">PDF Viewer settings:</p>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="showToolbar"
                  checked={showToolbar}
                  onCheckedChange={(checked) =>
                    setShowToolbar(checked === true)
                  }
                />
                <Label htmlFor="showToolbar">
                  Show toolbar (may not work on all browsers)
                </Label>
              </div>
            </div>

            <ClientOnly fallback={<Skeleton className="w-full h-[80vh]" />}>
              <PDFViewer
                key={JSON.stringify(debouncedPdfInputs)}
                showToolbar={showToolbar}
                width="100%"
                style={{ width: "100%", height: "80vh" }}
              >
                {PDFDocument}
              </PDFViewer>
            </ClientOnly>
          </CardContent>

          <CardFooter>
            <p>Border design by </p>
            <a
              href="https://www.freepik.com"
              target="_blank"
              rel="noreferrer"
              className="underline ml-1"
            >
              Freepik
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
