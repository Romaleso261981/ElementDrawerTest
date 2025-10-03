import { useState } from "react";
import {
  Typography,
  Alert,
  TextField,
  Box,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import "./styles.scss";

interface FormElement {
  row: number;
  column: number;
  label: string;
  type: "SELECT" | "TEXT_INPUT";
  options: string[];
}

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const parseInput = (text: string): FormElement[] => {
    const lines = text
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    const elements: FormElement[] = [];

    lines.forEach((line) => {
      const parts = line.split(";").map((p) => p.trim());
      if (parts.length === 5) {
        const [rowStr, colStr, label, type, optionsStr] = parts;
        const row = parseInt(rowStr);
        const column = parseInt(colStr);

        if (
          !isNaN(row) &&
          !isNaN(column) &&
          (type === "SELECT" || type === "TEXT_INPUT")
        ) {
          elements.push({
            row,
            column,
            label,
            type: type as "SELECT" | "TEXT_INPUT",
            options: optionsStr.split(",").map((o) => o.trim()),
          });
        }
      }
    });

    return elements;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const parsed = parseInput(value);
    setFormElements(parsed);
  };

  const handleFormValueChange = (label: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [label]: value }));
  };

  const groupByRow = (elements: FormElement[]) => {
    const rows: Record<number, FormElement[]> = {};
    elements.forEach((el) => {
      if (!rows[el.row]) rows[el.row] = [];
      rows[el.row].push(el);
    });
    Object.keys(rows).forEach((rowKey) => {
      rows[Number(rowKey)].sort((a, b) => a.column - b.column);
    });
    return rows;
  };

  const rowsData = groupByRow(formElements);
  const sortedRowNumbers = Object.keys(rowsData)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <Box className="element-drawer" sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h3" gutterBottom>
        Create an Element Drawer
      </Typography>

      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Enter strings with the following format:
        </Typography>

        <Typography
          variant="caption"
          component="p"
          sx={{ mb: 2, fontFamily: "monospace" }}
        >
          rowNumber;columnNumber;inputLabel;inputType;inputOptions
        </Typography>

        <Typography variant="body1" gutterBottom>
          Example:
        </Typography>

        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            component="p"
            sx={{ fontFamily: "monospace" }}
          >
            1;1;gender;SELECT;Male,Female
          </Typography>
          <Typography
            variant="caption"
            component="p"
            sx={{ fontFamily: "monospace" }}
          >
            2;1;firstName;TEXT_INPUT;Enter your first name
          </Typography>
        </Stack>

        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <Typography variant="caption" component="li">
            rowNumber - Row position of the element
          </Typography>
          <Typography variant="caption" component="li">
            columnNumber - Column position of the element
          </Typography>
          <Typography variant="caption" component="li">
            inputLabel - Label text of the input element
          </Typography>
          <Typography variant="caption" component="li">
            inputType - Input type (SELECT or TEXT_INPUT)
          </Typography>
          <Typography variant="caption" component="li">
            inputOptions - For SELECT: comma-separated options. For TEXT_INPUT:
            input placeholder text
          </Typography>
        </Box>
      </Alert>

      <TextField
        label="Element Drawer"
        placeholder="1;1;gender;SELECT;Male,Female"
        multiline
        fullWidth
        rows={6}
        value={inputValue}
        onChange={handleInputChange}
        sx={{ mt: 2, mb: 4 }}
      />

      {formElements.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Generated Form
          </Typography>
          <Box sx={{ mt: 3 }}>
            {sortedRowNumbers.map((rowNum) => (
              <Box
                key={rowNum}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 2,
                  mb: 2,
                }}
              >
                {rowsData[rowNum].map((element, idx) => (
                  <Box key={`${rowNum}-${idx}`}>
                    {element.type === "SELECT" ? (
                      <FormControl fullWidth>
                        <InputLabel>{element.label}</InputLabel>
                        <Select
                          value={formValues[element.label] || ""}
                          label={element.label}
                          onChange={(e) =>
                            handleFormValueChange(element.label, e.target.value)
                          }
                        >
                          {element.options.map((option, optIdx) => (
                            <MenuItem key={optIdx} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        label={element.label}
                        placeholder={element.options[0] || ""}
                        value={formValues[element.label] || ""}
                        onChange={(e) =>
                          handleFormValueChange(element.label, e.target.value)
                        }
                      />
                    )}
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
