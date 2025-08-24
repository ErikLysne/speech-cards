import { Font, Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { SpeechCard } from "~/types/speech-card";

Font.register({
  family: "Cormorant Garamond",
  src: "http://fonts.gstatic.com/s/cormorantgaramond/v3/EI2hhCO6kSfLAy-Dpd8fd4kMrRif0q9E9OjhWn94a1w.ttf",
});

const borderStyleMap: Record<number, string> = {
  1: "/border-1.jpg",
  2: "/border-2.jpg",
  3: "/border-3.jpg",
};

const borderPaddingMap: Record<
  number,
  {
    vertical: number;
    horizontal: number;
  }
> = {
  1: { vertical: 20, horizontal: 28 },
  2: { vertical: 24, horizontal: 40 },
  3: { vertical: 20, horizontal: 32 },
};

export type PDFCardProps = {
  card: SpeechCard;
  height?: string | number;
  showCutLine?: boolean;
  showCardNumber?: boolean;
  cardNumber?: number;
  cardTotal?: number;
  showBorder?: boolean;
  borderStyle?: 1 | 2 | 3;
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    rowGap: 8,
    fontFamily: "Cormorant Garamond",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    flexGrow: 1,
    overflow: "hidden",
    maxHeight: "100%",
  },
  cardNumberContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 8,
  },
  cardNumber: {
    fontSize: 16,
  },
  cardTotal: {
    fontSize: 10,
  },
  cutLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottom: "1pt dashed #ccc",
  },
  borderImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export const PDFCard: React.FC<PDFCardProps> = ({
  card,
  height,
  showCutLine,
  showCardNumber,
  cardNumber,
  cardTotal,
  showBorder,
  borderStyle,
}) => {
  // Calculate dynamic padding values
  const paddingVertical = borderStyle
    ? borderPaddingMap[borderStyle].vertical
    : 12;
  const paddingHorizontal = borderStyle
    ? borderPaddingMap[borderStyle].horizontal
    : 12;

  return (
    <View
      style={[
        styles.container,
        {
          height,
          paddingVertical,
          paddingHorizontal,
        },
      ]}
    >
      {showBorder && (
        <Image
          style={styles.borderImage}
          source={borderStyleMap[borderStyle || 1]}
        />
      )}

      <Text style={styles.title}>{card.title}</Text>
      <Text style={styles.content}>{card.content}</Text>

      {showCardNumber &&
        cardNumber !== undefined &&
        cardTotal !== undefined && (
          <View style={styles.cardNumberContainer}>
            <Text style={styles.cardNumber}>{cardNumber}</Text>
            <Text style={styles.cardTotal}>/{cardTotal}</Text>
          </View>
        )}

      {showCutLine && <View style={styles.cutLine} />}
    </View>
  );
};
