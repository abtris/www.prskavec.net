package main

import (
	"encoding/json"
	"fmt"
	"os"

	search "github.com/algolia/algoliasearch-client-go/v4/algolia/search"
)

type Index struct {
	Authors      []string `json:"authors"`
	Categories   []string `json:"categories"`
	Content      string   `json:"content"`
	Date         int      `json:"date"`
	Publishdate  string   `json:"publishdate"`
	Kind         string   `json:"kind"`
	Lang         string   `json:"lang"`
	ObjectID     string   `json:"objectID"`
	Summary      string   `json:"summary"`
	Tags         []string `json:"tags"`
	Title        string   `json:"title"`
	Section      string   `json:"section"`
	Type         string   `json:"type"`
	Permalink    string   `json:"permalink"`
	Relpermalink string   `json:"relpermalink"`
}

func main() {
	algoliaAppID := os.Getenv("ALGOLIA_APP_ID")
	algoliaAPIKey := os.Getenv("ALGOLIA_API_KEY")
	algoliaIndexName := os.Getenv("ALGOLIA_INDEX_NAME")

	client, err := search.NewClient(algoliaAppID, algoliaAPIKey)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	data, _ := os.ReadFile("public/index.json")
	var records []Index
	if errJSON := json.Unmarshal(data, &records); errJSON != nil {
		fmt.Println(errJSON)
		os.Exit(1)
	}
	// MAYBE(abtris): filter by type (get only type=post,talk)?
	var objects []map[string]any
	if b, errMarshal := json.Marshal(records); errMarshal == nil {
		json.Unmarshal(b, &objects) //nolint:errcheck
	}
	_, err = client.SaveObjects(algoliaIndexName, objects)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Index uploaded.")
	}
}
